import { BASE_API_URL } from '../../../utils/baseurl'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { FCMService } from '../Auth/AuthService'
// import { FCMService } from '../AuthService' // reuse FCM logic

const STAFF_URL = `${BASE_API_URL}/api/staff`

const axiosInstance = axios.create({
    baseURL: STAFF_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()
    const valid = await TokenManager.isValid()
    if (token && valid) config.headers.Authorization = `Bearer ${token}`
    config.headers['X-Device-Platform'] = Platform.OS
    config.headers['X-App-Version'] = '1.0.0'
    return config
})

const StaffService = {
    signinSendOTP: (data) =>
        axiosInstance.post('/signin/send-otp', data).then((r) => r.data),

    signinVerifyOTP: async (data) => {
        if (!data.deviceToken) data.deviceToken = await FCMService.getToken()
        data.platform = Platform.OS
        data.deviceId =
            (await AsyncStorage.getItem('deviceId')) || `dev_${Date.now()}`

        const res = await axiosInstance.post('/signin/verify-otp', data)
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

    logout: async () => {
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

    updateFCMToken: async () => {
        try {
            const fcmToken = await FCMService.getToken()
            if (!fcmToken) return null

            await axiosInstance.post('/device/register', {
                deviceToken: fcmToken,
                platform: Platform.OS,
                deviceId: await AsyncStorage.getItem('deviceId'),
            })
            return fcmToken
        } catch (error) {
            console.error('Staff FCM update failed:', error)
            return null
        }
    },
}

export default StaffService
