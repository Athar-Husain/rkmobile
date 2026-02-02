import { BASE_API_URL } from '../../../utils/baseurl.js'
import axios from 'axios'
import { TokenManager } from '../../../utils/tokenManager'
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { NotificationService } from '../Notifications/NotificationService.js'

const AUTH_URL = `${BASE_API_URL}/api/auth`

const axiosInstance = axios.create({
    baseURL: AUTH_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()
    const valid = await TokenManager.isValid()

    if (token && valid) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await TokenManager.clear()
        }
        return Promise.reject(error)
    }
)

// FCM Token Utility
const getFCMToken = async () => {
    try {
        // Check if user has granted permission
        const authStatus = await messaging().hasPermission()
        const granted =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL

        if (!granted) {
            return null // Return null if no permission
        }

        // Get FCM token
        const token = await messaging().getToken()
        return token
    } catch (error) {
        console.error('Error getting FCM token:', error)
        return null
    }
}

// Send FCM token to backend
const registerFCMToken = async (authToken) => {
    try {
        const fcmToken = await getFCMToken()
        if (!fcmToken) return

        await axios.post(
            `${BASE_API_URL}/api/notifications/register-token`,
            {
                fcmToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        )
    } catch (error) {
        console.error('Failed to register FCM token:', error)
        // Don't throw error - FCM registration failure shouldn't block auth flow
    }
}

const AuthService = {
    /* ---------- SIGNUP ---------- */
    signupSendOTP: (data) =>
        axiosInstance
            .post(`${AUTH_URL}/signup/send-otp`, data)
            .then((r) => r.data),

    signupVerifyOTP2: async (data) => {
        const res = await axiosInstance.post(
            `${AUTH_URL}/signup/verify-otp`,
            data
        )
        const { token, expiresIn } = res.data
        if (token && expiresIn) {
            await TokenManager.save(token, expiresIn)
            // Get FCM token and send to server
            const fcmToken = await getFCMToken()
            if (fcmToken) {
                // We don't wait for this to complete
                axiosInstance
                    .post(`${AUTH_URL}/register-fcm`, { fcmToken })
                    .catch((e) =>
                        console.error('Failed to register FCM token', e)
                    )
            }
        }
        return res.data
    },

    signupVerifyOTP: async (data) => {
        const res = await axiosInstance.post(
            `${AUTH_URL}/signup/verify-otp`,
            data
        )
        const { token, expiresIn } = res.data
        if (token && expiresIn) {
            await TokenManager.save(token, expiresIn)
            // Send FCM token to server
            NotificationService.sendFCMTokenToServer()
        }
        return res.data
    },

    /* ---------- SIGNIN ---------- */
    signinSendOTP: (data) =>
        axiosInstance
            .post(`${AUTH_URL}/signin/send-otp`, data)
            .then((r) => r.data),

    signinVerifyOTP: async (data) => {
        const res = await axiosInstance.post(
            `${AUTH_URL}/signin/verify-otp`,
            data
        )
        const { token, expiresIn } = res.data

        if (token && expiresIn) {
            await TokenManager.save(token, expiresIn)
            // Register FCM token after successful auth
            await registerFCMToken(token)
        }
        return res.data
    },

    /* ---------- PASSWORD ---------- */
    forgotPassword: (data) =>
        axiosInstance
            .post(`${AUTH_URL}/forgot-password`, data)
            .then((r) => r.data),

    resetPassword: (data) =>
        axiosInstance
            .post(`${AUTH_URL}/reset-password`, data)
            .then((r) => r.data),

    /* ---------- SESSION ---------- */
    logout: async () => {
        try {
            // Unregister FCM token from server
            const token = await TokenManager.getToken()
            if (token) {
                const fcmToken = await getFCMToken()
                if (fcmToken) {
                    await axiosInstance.post(`${AUTH_URL}/logout/device`, {
                        fcmToken,
                    })
                }
            }
        } catch (error) {
            console.error('Error during logout FCM cleanup:', error)
        } finally {
            await axiosInstance.post('/logout')
            await TokenManager.clear()
            await AsyncStorage.removeItem('onboarding_completed')
        }
        return true
    },

    /* ---------- FCM MANAGEMENT ---------- */
    updateFCMToken: async () => {
        const token = await TokenManager.getToken()
        if (!token) return

        try {
            const fcmToken = await getFCMToken()
            if (!fcmToken) return

            await axiosInstance.post(`${AUTH_URL}/update-fcm-token`, {
                fcmToken,
            })
        } catch (error) {
            console.error('Failed to update FCM token:', error)
        }
    },

    /* ---------- PROFILE ---------- */
    getLoginStatus: async () => {
        const res = await axiosInstance.get('/login-status').then((r) => r.data)
        const hasCompletedOnboarding =
            (await AsyncStorage.getItem('onboarding_completed')) === 'true'
        return { ...res, hasCompletedOnboarding }
    },

    getProfile: () => axiosInstance.get('/profile').then((r) => r.data.user),

    /* ---------- ONBOARDING (LOCAL) ---------- */
    markOnboardingComplete: async () => {
        await AsyncStorage.setItem('onboarding_completed', 'true')
        return true
    },

    resetOnboarding: async () => {
        await AsyncStorage.setItem('onboarding_completed', 'false')
        return true
    },
}

export default AuthService
