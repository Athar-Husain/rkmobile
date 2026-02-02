// src/api/notificationService.js
import axios from 'axios'
import { BASE_API_URL } from '../../../utils/baseurl'
import { TokenManager } from '../Customers/CustomerService'

const NOTIFICATION_URL = `${BASE_API_URL}/api/notifications`

// ✅ Create Axios instance
const axiosInstance = axios.create({
    baseURL: NOTIFICATION_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// ✅ Add Authorization header interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await TokenManager.getToken()
            const isValid = await TokenManager.isValid()

            if (token && isValid) {
                config.headers.Authorization = `Bearer ${token}`
            }
        } catch (err) {
            console.error('Token error:', err)
        }
        return config
    },
    (error) => Promise.reject(error)
)

// =============================
// 🔹 Notification API Functions
// =============================

// Send notification to one customer
export const sendNotificationToCustomer = async (data) => {
    const res = await axiosInstance.post('/send-to-customer', data)
    return res.data
}

// Send notification to all customers
export const sendNotificationToAllCustomers = async (data) => {
    const res = await axiosInstance.post('/send-to-all', data)
    return res.data
}

// Register customer FCM token
export const registerCustomerFCMToken = async (data) => {
    const res = await axiosInstance.post('/register-token', data)
    return res.data
}

// Unregister FCM token (logout)
export const unregisterCustomerFCMToken = async (data) => {
    const res = await axiosInstance.post('/unregister-token', data)
    return res.data
}

// Get all notifications for user
export const getNotificationsForUser = async () => {
    const res = await axiosInstance.get('/getNotifications')
    return res.data
}

// Mark single notification as read
export const markNotificationAsRead = async (notificationId) => {
    const res = await axiosInstance.patch(`/${notificationId}/read`)
    return res.data
}

// Delete notification
export const deleteNotification = async (notificationId) => {
    const res = await axiosInstance.delete(`/${notificationId}`)
    return res.data
}

// ✅ Export as service object
const notificationService = {
    sendNotificationToCustomer,
    sendNotificationToAllCustomers,
    registerCustomerFCMToken,
    unregisterCustomerFCMToken,
    getNotificationsForUser,
    markNotificationAsRead,
    deleteNotification,
}

export default notificationService
