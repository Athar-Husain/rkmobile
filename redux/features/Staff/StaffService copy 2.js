import { BASE_API_URL } from '../../../utils/baseurl'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { FCMService } from '../Auth/AuthService'
// import { TokenManager } from '../../../utils/tokenManager'
// import { FCMService } from './AuthService' // reuse FCM logic

const STAFF_URL = `${BASE_API_URL}/api/staff`

const axiosInstance = axios.create({
    baseURL: STAFF_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
})

// // Attach token and device info to every request
// axiosInstance.interceptors.request.use(async (config) => {
//     const token = await TokenManager.getToken()
//     const valid = await TokenManager.isValid()
//     if (token && valid) config.headers.Authorization = `Bearer ${token}`
//     config.headers['X-Device-Platform'] = Platform.OS
//     config.headers['X-App-Version'] = '1.0.0'
//     return config
// })

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
                        `${STAFF_URL}/refresh-token`,
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

const StaffService = {
    // =========================
    // Public Auth Routes
    // =========================
    signinSendOTP: (data) =>
        axiosInstance.post('/send-otp', data).then((res) => res.data),

    signinVerifyOTP: async (data) => {
        if (!data.deviceToken) data.deviceToken = await FCMService.getToken()
        data.platform = Platform.OS
        data.deviceId =
            (await AsyncStorage.getItem('deviceId')) || `dev_${Date.now()}`

        const res = await axiosInstance.post('/verify-otp', data)
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

    refreshToken: async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token')

            const res = await axiosInstance.post('/refresh-token', {
                refreshToken,
            })
            if (res.data.token) {
                await TokenManager.save(res.data.token, res.data.expiresIn)
                if (res.data.refreshToken)
                    await AsyncStorage.setItem(
                        'refreshToken',
                        res.data.refreshToken
                    )
            }
            return res.data
        } catch (error) {
            throw error
        }
    },

    staffForgotPassword: (data) =>
        axiosInstance.post('/forgot-password', data).then((res) => res.data),

    staffResetPassword: (data) =>
        axiosInstance.post('/reset-password', data).then((res) => res.data),

    // =========================
    // Protected Staff Routes
    // =========================
    getStaffProfile: () =>
        axiosInstance.get('/profile').then((res) => res.data),

    updateStaffProfile: (data) =>
        axiosInstance.patch('/profile', data).then((res) => res.data),

    registerStaffFCMToken: async () => {
        try {
            const fcmToken = await FCMService.getToken()
            if (!fcmToken) return null

            await axiosInstance.post('/register-device', {
                deviceToken: fcmToken,
                platform: Platform.OS,
                deviceId: await AsyncStorage.getItem('deviceId'),
            })

            return fcmToken
        } catch (error) {
            console.error('Staff FCM registration failed:', error)
            return null
        }
    },

    staffLogout: async () => {
        try {
            const deviceToken = await FCMService.getToken()
            const deviceId = await AsyncStorage.getItem('deviceId')

            await axiosInstance.post('/logout', {
                deviceToken,
                deviceId,
                platform: Platform.OS,
            })
        } catch (e) {
            console.warn('Staff logout failed, proceeding with local cleanup')
        } finally {
            await TokenManager.clear()
            await AsyncStorage.multiRemove([
                'refreshToken',
                'userData',
                'fcm_token',
            ])
        }
        return true
    },

    getStaffDashboard: () =>
        axiosInstance.get('/dashboard').then((res) => res.data),

    getStaffLoginStatus: () =>
        axiosInstance.get('/login-status').then((res) => res.data),

    // =========================
    // Admin Routes: Manage Staff
    // =========================
    createStaff: (data) =>
        axiosInstance.post('/create', data).then((res) => res.data),

    getAllStaff: () =>
        axiosInstance.get('/getAllStaff').then((res) => res.data),

    getStaffById: (id) =>
        axiosInstance.get(`/getStaffById/${id}`).then((res) => res.data),

    deleteStaff: (id) =>
        axiosInstance.delete(`/deleteStaff/${id}`).then((res) => res.data),
}

export default StaffService
