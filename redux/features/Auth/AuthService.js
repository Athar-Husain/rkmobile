// redux/features/Auth/AuthService.js
import { BASE_API_URL } from '../../../utils/baseurl.js'
import axios from 'axios'
import { TokenManager } from '../../../utils/tokenManager'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { getApp } from '@react-native-firebase/app'
import { getMessaging, getToken } from '@react-native-firebase/messaging'

const AUTH_URL = `${BASE_API_URL}/api/auth`

const axiosInstance = axios.create({
    baseURL: AUTH_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
})

/* -------------------- INTERCEPTORS -------------------- */

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await TokenManager.getToken()
        const valid = await TokenManager.isValid()

        if (token && valid) {
            config.headers.Authorization = `Bearer ${token}`
        }

        config.headers['X-Device-Platform'] = Platform.OS
        config.headers['X-App-Version'] = '1.0.0'
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken')
                if (refreshToken) {
                    const response = await axios.post(
                        `${AUTH_URL}/refresh-token`,
                        { refreshToken }
                    )
                    const { token, expiresIn } = response.data
                    if (token && expiresIn) {
                        await TokenManager.save(token, expiresIn)
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return axiosInstance(originalRequest)
                    }
                }
            } catch (refreshError) {
                await TokenManager.clear()
                await AsyncStorage.removeItem('refreshToken')
            }
        }
        return Promise.reject(error)
    }
)

/* -------------------- FCM SERVICE -------------------- */

export const FCMService = {
    getToken: async () => {
        try {
            let fcmToken = await AsyncStorage.getItem('fcm_token')
            if (fcmToken) return fcmToken

            // Safety check for Firebase instance
            const app = getApp()
            if (!app) return null

            const messaging = getMessaging(app)

            if (Platform.OS === 'ios') {
                await messaging.requestPermission()
            }

            const newToken = await getToken(messaging)
            if (newToken) {
                await AsyncStorage.setItem('fcm_token', newToken)
                return newToken
            }
            return null
        } catch (error) {
            console.error('FCM Token Error:', error)
            return null
        }
    },

    deleteToken: async () => {
        try {
            await AsyncStorage.removeItem('fcm_token')
            return true
        } catch (error) {
            return false
        }
    },
}

/* -------------------- AUTH SERVICE -------------------- */

const AuthService = {
    signupSendOTP: (data) =>
        axiosInstance.post(`/signup/send-otp`, data).then((r) => r.data),

    signupVerifyOTP: async (data) => {
        if (!data.deviceToken) data.deviceToken = await FCMService.getToken()
        data.platform = Platform.OS
        data.deviceId =
            (await AsyncStorage.getItem('deviceId')) || `dev_${Date.now()}`

        const res = await axiosInstance.post(`/signup/verify-otp`, data)
        if (res.data.token) {
            await TokenManager.save(res.data.token, res.data.expiresIn)
            if (res.data.refreshToken)
                await AsyncStorage.setItem(
                    'refreshToken',
                    res.data.refreshToken
                )
            await AsyncStorage.setItem(
                'userData',
                JSON.stringify(res.data.user)
            )
        }
        return res.data
    },

    signinSendOTP: (data) =>
        axiosInstance.post(`/signin/send-otp`, data).then((r) => r.data),

    signinVerifyOTP: async (data) => {
        if (!data.deviceToken) data.deviceToken = await FCMService.getToken()
        data.platform = Platform.OS
        data.deviceId =
            (await AsyncStorage.getItem('deviceId')) || `dev_${Date.now()}`

        const res = await axiosInstance.post(`/signin/verify-otp`, data)
        if (res.data.token) {
            await TokenManager.save(res.data.token, res.data.expiresIn)
            if (res.data.refreshToken)
                await AsyncStorage.setItem(
                    'refreshToken',
                    res.data.refreshToken
                )
            await AsyncStorage.setItem(
                'userData',
                JSON.stringify(res.data.user)
            )
        }
        return res.data
    },

    logout: async (deviceToken = null) => {
        try {
            const storedDeviceId = await AsyncStorage.getItem('deviceId')
            // Use provided token or try to get it safely
            const finalFcmToken =
                deviceToken || (await FCMService.getToken().catch(() => null))

            // Backend notification of logout
            await axiosInstance.post(
                '/logout',
                {
                    deviceToken: finalFcmToken || undefined,
                    deviceId: storedDeviceId || undefined,
                    platform: Platform.OS,
                },
                { timeout: 5000 }
            )
        } catch (error) {
            console.warn('Backend logout failed, proceeding with local cleanup')
        } finally {
            // ATOMIC LOCAL CLEANUP: Ensures user is logged out even if network fails
            try {
                await TokenManager.clear()
                await AsyncStorage.multiRemove([
                    'refreshToken',
                    'userData',
                    'fcm_token',
                ])
            } catch (e) {
                console.error('Cleanup error:', e)
            }
        }
        return true
    },

    updateFCMToken: async () => {
        try {
            const token = await TokenManager.getToken()
            const fcmToken = await FCMService.getToken()
            if (!token || !fcmToken) return null

            await axiosInstance.post(`/device/register`, {
                deviceToken: fcmToken,
                platform: Platform.OS,
                deviceId: await AsyncStorage.getItem('deviceId'),
            })
            return fcmToken
        } catch (error) {
            return null
        }
    },

    getLoginStatus: async () => {
        const res = await axiosInstance.get('/login-status').then((r) => r.data)
        const completed =
            (await AsyncStorage.getItem('onboarding_completed')) === 'true'
        if (res.user)
            await AsyncStorage.setItem('userData', JSON.stringify(res.user))
        return { ...res, hasCompletedOnboarding: completed }
    },

    getProfile: () => axiosInstance.get('/profile').then((r) => r.data.user),

    updateProfile: (data) =>
        axiosInstance.put('/profile', data).then((r) => r.data),

    getStoredUserData: async () => {
        const data = await AsyncStorage.getItem('userData')
        return data ? JSON.parse(data) : null
    },

    isAuthenticated: async () => {
        const token = await TokenManager.getToken()
        const valid = await TokenManager.isValid()
        return !!(token && valid)
    },

    // Added to prevent missing function errors in your logic
    markOnboardingComplete: async () =>
        AsyncStorage.setItem('onboarding_completed', 'true'),
    resetOnboarding: async () =>
        AsyncStorage.setItem('onboarding_completed', 'false'),
}

AuthService.FCMService = FCMService
export default AuthService
