import axios from 'axios'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { BASE_API_URL } from '../../../utils/baseurl'

// const COUPON_URL = `${BASE_API_URL}/api/coupons`

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

// src/features/notifications/NotificationService.js

const NotificationService = {
    // USER - 3 TAB SYSTEM
    myNotifications: () =>
        axiosInstance.get('/myNotifications').then((res) => res.data),

    read: () =>
        axiosInstance.get('/read').then((res) => res.data),

    getCouponHistory: () =>
        axiosInstance.get('/getMyCouponHistory').then((res) => res.data),

    getCouponSavings: () =>
        axiosInstance.get('/getMyCouponSavings').then((res) => res.data),

    read: (id) =>
        axiosInstance.post(`/read/${id}`).then((res) => res.data),

    // STAFF
    read: (data) =>
        axiosInstance.post('/read', data).then((res) => res.data),

    redeemCoupon: (data) =>
        axiosInstance.post('/redeem', data).then((res) => res.data),

    // ADMIN
    createCoupon: (data) =>
        axiosInstance.post('/createCoupon', data).then((res) => res.data),

    getAllCouponsAdmin: () =>
        axiosInstance.get('/getAllCoupons').then((res) => res.data),
}

export default NotificationService
