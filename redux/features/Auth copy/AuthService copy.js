import { BASE_API_URL } from '../../../utils/baseurl.js'
import axios from 'axios'
import { TokenManager } from '../../../utils/tokenManager'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging'

const AUTH_URL = `${BASE_API_URL}/api/auth`

const axiosInstance = axios.create({
    baseURL: AUTH_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000, // 30 seconds timeout
})

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await TokenManager.getToken()
        const valid = await TokenManager.isValid()

        if (token && valid) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Add device info to all requests
        config.headers['X-Device-Platform'] = Platform.OS
        config.headers['X-App-Version'] = '1.0.0' // Update with actual version

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config

//         // Handle 401 Unauthorized
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true

//             try {
//                 // Try to refresh token
//                 const refreshToken = await AsyncStorage.getItem('refreshToken')
//                 if (refreshToken) {
//                     const response = await axios.post(
//                         `${AUTH_URL}/refresh-token`,
//                         {
//                             refreshToken,
//                         }
//                     )

//                     const { token, expiresIn } = response.data
//                     if (token && expiresIn) {
//                         await TokenManager.save(token, expiresIn)

//                         // Retry original request with new token
//                         originalRequest.headers.Authorization = `Bearer ${token}`
//                         return axiosInstance(originalRequest)
//                     }
//                 }
//             } catch (refreshError) {
//                 console.error('Token refresh failed:', refreshError)
//                 await TokenManager.clear()
//                 await AsyncStorage.removeItem('refreshToken')
//             }
//         }

//         // Handle network errors
//         if (!error.response) {
//             error.response = {
//                 data: {
//                     message: 'Network error. Please check your connection.',
//                 },
//             }
//         }

//         return Promise.reject(error)
//     }
// )

// AuthService.js rewrite for interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken')
                // Use standard axios for refresh to avoid interceptor loop
                const response = await axios.post(`${AUTH_URL}/refresh-token`, {
                    refreshToken,
                })

                const { token, expiresIn } = response.data
                await TokenManager.save(token, expiresIn)

                originalRequest.headers.Authorization = `Bearer ${token}`
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                // If refresh fails, the user MUST log in again
                await TokenManager.clear()
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

// FCM Token Management
export const FCMService = {
    // Get FCM token with permission check
    getToken: async () => {
        try {
            // Check permissions
            const authStatus = await messaging().hasPermission()
            const granted =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL

            if (!granted) {
                // Request permission
                const requestedStatus = await messaging().requestPermission()
                if (
                    requestedStatus !==
                        messaging.AuthorizationStatus.AUTHORIZED &&
                    requestedStatus !==
                        messaging.AuthorizationStatus.PROVISIONAL
                ) {
                    return null
                }
            }

            // For iOS, register for remote messages
            if (Platform.OS === 'ios') {
                await messaging().registerDeviceForRemoteMessages()
            }

            // Get or generate token
            let fcmToken = await AsyncStorage.getItem('fcm_token')

            if (!fcmToken) {
                fcmToken = await messaging().getToken()
                if (fcmToken) {
                    await AsyncStorage.setItem('fcm_token', fcmToken)
                }
            }

            return fcmToken
        } catch (error) {
            console.error('FCM Token Error:', error)
            return null
        }
    },

    // Check if notifications are enabled
    isNotificationsEnabled: async () => {
        try {
            const authStatus = await messaging().hasPermission()
            return (
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL
            )
        } catch (error) {
            return false
        }
    },

    // Delete FCM token (on logout)
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

            // Add platform and device info
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

                // Save user data to AsyncStorage for quick access
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

    signinVerifyOTP1: async (data) => {
        try {
            // Get FCM token if not provided
            if (!data.deviceToken) {
                data.deviceToken = await FCMService.getToken()
            }

            // Add platform and device info
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

                // Save user data to AsyncStorage for quick access
                await AsyncStorage.setItem('userData', JSON.stringify(user))
            }

            return res.data
        } catch (error) {
            console.error('Signin Verify OTP Error:', error)
            throw error
        }
    },
    // Example of a cleaner Service method
    signinVerifyOTP: async (data) => {
        // Only fetch tokens if missing
        if (!data.deviceToken) {
            data.deviceToken = await FCMService.getToken()
        }

        const res = await axiosInstance.post(
            `${AUTH_URL}/signin/verify-otp`,
            data
        )
        return res.data // Just return data, let the Slice/Thunk handle storage
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
    logout: async (deviceToken = null) => {
        try {
            const fcmToken = deviceToken || (await FCMService.getToken())

            // Remove device token from backend
            if (fcmToken) {
                await axiosInstance
                    .post(`${AUTH_URL}/logout/device`, {
                        deviceToken: fcmToken,
                    })
                    .catch((err) => {
                        console.warn('Device logout failed:', err)
                        // Continue with logout even if this fails
                    })
            }

            // Call main logout endpoint
            await axiosInstance.post('/logout')

            // Clear local storage
            await TokenManager.clear()
            await AsyncStorage.multiRemove([
                'refreshToken',
                'userData',
                'onboarding_completed',
            ])

            // Delete FCM token
            await FCMService.deleteToken()

            return true
        } catch (error) {
            console.error('Logout Error:', error)

            // Even if server logout fails, clear local storage
            await TokenManager.clear()
            await AsyncStorage.multiRemove([
                'refreshToken',
                'userData',
                'onboarding_completed',
            ])

            throw error
        }
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

    registerFCMToken: async (fcmToken = null) => {
        try {
            const token = await TokenManager.getToken()
            if (!token) return null

            const tokenToRegister = fcmToken || (await FCMService.getToken())
            if (!tokenToRegister) return null

            await axiosInstance.post(`${AUTH_URL}/device/register`, {
                deviceToken: tokenToRegister,
                platform: Platform.OS,
                deviceId: await AsyncStorage.getItem('deviceId'),
            })

            return tokenToRegister
        } catch (error) {
            console.error('Register FCM Token Error:', error)
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

            // Store user data if available
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

    // Check if user is authenticated (local check)
    isAuthenticated: async () => {
        try {
            const token = await TokenManager.getToken()
            const valid = await TokenManager.isValid()
            return !!(token && valid)
        } catch (error) {
            return false
        }
    },

    // Get device ID
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

// Export FCMService as well
AuthService.FCMService = FCMService

export default AuthService
