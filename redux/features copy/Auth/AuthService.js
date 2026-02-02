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

// Request interceptor
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

// Response interceptor
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
                        {
                            refreshToken,
                        }
                    )

                    const { token, expiresIn } = response.data
                    if (token && expiresIn) {
                        await TokenManager.save(token, expiresIn)
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return axiosInstance(originalRequest)
                    }
                }
            } catch (refreshError) {
                console.log('Token refresh failed:', refreshError)
                await TokenManager.clear()
                await AsyncStorage.removeItem('refreshToken')
            }
        }

        if (!error.response) {
            error.response = {
                data: {
                    message: 'Network error. Please check your connection.',
                },
            }
        }

        return Promise.reject(error)
    }
)

// FCM Token Management - CORRECTLY EXPORTED
export const FCMService = {
    getToken: async () => {
        try {
            // Check if token already exists
            let fcmToken = await AsyncStorage.getItem('fcm_token')

            if (fcmToken) {
                return fcmToken
            }

            const app = getApp()
            const messaging = getMessaging(app)

            // Request permission for iOS
            if (Platform.OS === 'ios') {
                await messaging.requestPermission()
            }

            // Generate new token
            const newToken = await getToken(messaging)

            if (newToken) {
                await AsyncStorage.setItem('fcm_token', newToken)
                console.log('New FCM token generated:', newToken)
                return newToken
            }

            return null
        } catch (error) {
            console.error('FCM Token Error:', error)
            return null
        }
    },

    isNotificationsEnabled: async () => {
        try {
            const app = getApp()
            const messaging = getMessaging(app)
            const permission = await messaging.hasPermission()
            return permission === 1 // 1 = granted
        } catch (error) {
            return false
        }
    },

    deleteToken: async () => {
        try {
            await AsyncStorage.removeItem('fcm_token')
            return true
        } catch (error) {
            console.error('Error deleting FCM token:', error)
            return false
        }
    },
}

const AuthService = {
    /* ---------- SIGNUP ---------- */
    signupSendOTP: (data) =>
        axiosInstance
            .post(`${AUTH_URL}/signup/send-otp`, data)
            .then((r) => r.data),

    signupVerifyOTP: async (data) => {
        try {
            // Get FCM token if not provided
            if (!data.deviceToken) {
                data.deviceToken = await FCMService.getToken()
            }

            data.platform = Platform.OS
            data.deviceId =
                (await AsyncStorage.getItem('deviceId')) ||
                `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

            const res = await axiosInstance.post(
                `${AUTH_URL}/signup/verify-otp`,
                data
            )
            const { token, refreshToken, expiresIn, user } = res.data

            if (token && expiresIn) {
                await TokenManager.save(token, expiresIn)
                if (refreshToken) {
                    await AsyncStorage.setItem('refreshToken', refreshToken)
                }
                await AsyncStorage.setItem('userData', JSON.stringify(user))
            }

            return res.data
        } catch (error) {
            console.error('Signup Verify OTP Error:', error)
            throw error
        }
    },

    /* ---------- SIGNIN ---------- */
    signinSendOTP: (data) =>
        axiosInstance
            .post(`${AUTH_URL}/signin/send-otp`, data)
            .then((r) => r.data),

    signinVerifyOTP: async (data) => {
        try {
            // Get FCM token if not provided
            if (!data.deviceToken) {
                data.deviceToken = await FCMService.getToken()
            }

            data.platform = Platform.OS
            data.deviceId =
                (await AsyncStorage.getItem('deviceId')) ||
                `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

            const res = await axiosInstance.post(
                `${AUTH_URL}/signin/verify-otp`,
                data
            )
            const { token, refreshToken, expiresIn, user } = res.data

            if (token && expiresIn) {
                await TokenManager.save(token, expiresIn)
                if (refreshToken) {
                    await AsyncStorage.setItem('refreshToken', refreshToken)
                }
                await AsyncStorage.setItem('userData', JSON.stringify(user))
            }

            return res.data
        } catch (error) {
            console.error('Signin Verify OTP Error:', error)
            throw error
        }
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

    /* ---------- SESSION MANAGEMENT ---------- */
    logoutold: async (deviceToken = null) => {
        let fcmToken = null

        try {
            // Try to get FCM token (non-blocking)
            fcmToken = deviceToken || (await FCMService.getToken())

            // Call SINGLE backend logout endpoint
            await axiosInstance.post('/logout', {
                deviceToken: fcmToken || undefined,
                deviceId: await AsyncStorage.getItem('deviceId'),
            })
        } catch (error) {
            console.warn(
                'Backend logout failed (safe to ignore):',
                error.response?.status
            )
        } finally {
            // 🔥 ALWAYS clear local session
            await TokenManager.clear()
            await AsyncStorage.multiRemove([
                'refreshToken',
                'userData',
                'fcm_token',
                // 'onboarding_completed',
            ])
        }

        return true
    },

    logout: async (deviceToken = null) => {
        try {
            // 1. Prepare data in parallel to save time
            const [storedDeviceId, storedFcmToken] = await Promise.all([
                AsyncStorage.getItem('deviceId'),
                !deviceToken ? FCMService.getToken().catch(() => null) : null,
            ])

            const finalFcmToken = deviceToken || storedFcmToken

            // 2. Attempt Backend Logout (with a timeout)
            // We use a shorter timeout because we don't want the user
            // stuck on a "logging out..." spinner if the server is slow.
            await axiosInstance.post(
                '/logout',
                {
                    deviceToken: finalFcmToken || undefined,
                    deviceId: storedDeviceId || undefined,
                    platform: Platform.OS, // Good for backend analytics
                },
                { timeout: 5000 }
            )

            console.log('Backend session invalidated successfully')
        } catch (error) {
            // Log error but don't stop the flow
            console.warn(
                'Backend logout sync failed:',
                error.response?.data?.message || error.message
            )
        } finally {
            // 3. ATOMIC CLEANUP
            // We clear everything in the finally block to ensure
            // the user is never "stuck" in a logged-in state.
            try {
                await TokenManager.clear()

                // Define keys to remove
                const keysToRemove = [
                    'refreshToken',
                    'userData',
                    'fcm_token',
                    // 'auth_status' // Useful for navigation guards
                ]

                await AsyncStorage.multiRemove(keysToRemove)

                // 4. Optional: Reset your Redux/Zustand store here
                // useAuthStore.getState().reset();

                console.log('Local session wiped successfully')
            } catch (cleanupError) {
                console.error(
                    'Critical failure during local cleanup:',
                    cleanupError
                )
            }
        }

        return true
    },

    /* ---------- FCM MANAGEMENT ---------- */
    updateFCMToken: async () => {
        try {
            const token = await TokenManager.getToken()
            if (!token) return null

            const fcmToken = await FCMService.getToken()
            if (!fcmToken) return null

            await axiosInstance.post(`${AUTH_URL}/device/register`, {
                deviceToken: fcmToken,
                platform: Platform.OS,
                deviceId: await AsyncStorage.getItem('deviceId'),
            })

            return fcmToken
        } catch (error) {
            console.error('Update FCM Token Error:', error)
            return null
        }
    },

    /* ---------- PROFILE & STATUS ---------- */
    getLoginStatus: async () => {
        try {
            const res = await axiosInstance
                .get('/login-status')
                .then((r) => r.data)
            const hasCompletedOnboarding =
                (await AsyncStorage.getItem('onboarding_completed')) === 'true'

            if (res.user) {
                await AsyncStorage.setItem('userData', JSON.stringify(res.user))
            }

            return { ...res, hasCompletedOnboarding }
        } catch (error) {
            console.error('Get Login Status Error:', error)
            throw error
        }
    },

    getProfile: () => axiosInstance.get('/profile').then((r) => r.data.user),

    updateProfile: (data) =>
        axiosInstance.put('/profile', data).then((r) => r.data),

    /* ---------- TOKEN MANAGEMENT ---------- */
    refreshToken: async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token')

            const response = await axios.post(`${AUTH_URL}/refresh-token`, {
                refreshToken,
            })

            const {
                token,
                refreshToken: newRefreshToken,
                expiresIn,
            } = response.data

            if (token && expiresIn) {
                await TokenManager.save(token, expiresIn)
                if (newRefreshToken) {
                    await AsyncStorage.setItem('refreshToken', newRefreshToken)
                }
            }

            return response.data
        } catch (error) {
            console.error('Token Refresh Error:', error)
            await TokenManager.clear()
            await AsyncStorage.removeItem('refreshToken')
            throw error
        }
    },

    validateReferralCode: (code) =>
        axiosInstance.get(`/referral/validate/${code}`).then((r) => r.data),

    getDashboard: () =>
        axiosInstance.get('/dashboard').then((r) => r.data.dashboard),

    /* ---------- ONBOARDING (LOCAL) ---------- */
    markOnboardingComplete: async () => {
        try {
            await AsyncStorage.setItem('onboarding_completed', 'true')
            return true
        } catch (error) {
            console.error('Mark Onboarding Complete Error:', error)
            return false
        }
    },

    resetOnboarding: async () => {
        try {
            await AsyncStorage.setItem('onboarding_completed', 'false')
            return true
        } catch (error) {
            console.error('Reset Onboarding Error:', error)
            return false
        }
    },

    /* ---------- UTILITIES ---------- */
    getStoredUserData: async () => {
        try {
            const userData = await AsyncStorage.getItem('userData')
            return userData ? JSON.parse(userData) : null
        } catch (error) {
            console.error('Get Stored User Data Error:', error)
            return null
        }
    },

    clearStoredUserData: async () => {
        try {
            await AsyncStorage.removeItem('userData')
            return true
        } catch (error) {
            console.error('Clear Stored User Data Error:', error)
            return false
        }
    },

    isAuthenticated: async () => {
        try {
            const token = await TokenManager.getToken()
            const valid = await TokenManager.isValid()
            return !!(token && valid)
        } catch (error) {
            return false
        }
    },

    getDeviceId: async () => {
        try {
            let deviceId = await AsyncStorage.getItem('deviceId')
            if (!deviceId) {
                deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                await AsyncStorage.setItem('deviceId', deviceId)
            }
            return deviceId
        } catch (error) {
            return `device_error_${Date.now()}`
        }
    },
}

// Also attach FCMService to AuthService for backward compatibility
AuthService.FCMService = FCMService

export default AuthService
