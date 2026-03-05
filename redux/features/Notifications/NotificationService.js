import axios from 'axios'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { BASE_API_URL } from '../../../utils/baseurl'

const NOTIFICATION_URL = `${BASE_API_URL}/api/notifications`

// Create the instance
const axiosInstance = axios.create({
    baseURL: NOTIFICATION_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000, // Giant App Standard: Always set a timeout
})

// Request Interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await TokenManager.getToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            config.headers['X-Device-Platform'] = Platform.OS
        } catch (e) {
            // Silence silent failures that lead to undefined calls
            console.error('Auth Interceptor Error', e)
        }
        return config
    },
    (error) => Promise.reject(error)
)

const NotificationService = {
    getMyNotifications: async (params) => {
        const res = await axiosInstance.get('/my-notifications', { params })
        return res.data
    },

    markNotificationsAsRead: async (ids) => {
        const res = await axiosInstance.patch('/read', { ids })
        return res.data
    },

    markAllNotificationsAsRead: async () => {
        const res = await axiosInstance.patch('/read-all')
        return res.data
    },
}

export default NotificationService
