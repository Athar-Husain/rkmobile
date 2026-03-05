import axios from 'axios'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { BASE_API_URL } from '../../../utils/baseurl'

const NOTIFICATION_URL = `${BASE_API_URL}/api/notifications`

const axiosInstance = axios.create({
    baseURL: NOTIFICATION_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()

    if (token) config.headers.Authorization = `Bearer ${token}`

    config.headers['X-Device-Platform'] = Platform.OS
    return config
})

const NotificationService = {
    // ==========================
    // GET MY NOTIFICATIONS
    // ==========================
    getMyNotifications: (params) =>
        axiosInstance
            .get('/my-notifications', { params })
            .then((res) => res.data),

    // ==========================
    // MARK SELECTED AS READ
    // ==========================
    markNotificationsAsRead: (ids) =>
        axiosInstance.patch('/read', { ids }).then((res) => res.data),

    // ==========================
    // MARK ALL AS READ
    // ==========================
    markAllNotificationsAsRead: () =>
        axiosInstance.patch('/read-all').then((res) => res.data),
}

export default NotificationService
