import axios from 'axios'
// import { TokenManager } from '../Admin/adminService';

import { TokenManager } from '../../../utils/tokenManager'
import { BASE_API_URL } from '../../../utils/baseurl'
import { Platform } from 'react-native'
// ===============================
// Configuration
// ===============================
// const BASE_API_URL = import.meta.env.VITE_BACKEND_URL
const COUPON_URL = `${BASE_API_URL}/api/coupons`

// ===============================
// Axios Instance
// ===============================
const axiosInstance = axios.create({
    baseURL: COUPON_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = TokenManager.getToken()
//         if (token && TokenManager.isValid()) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         return config
//     },
//     (error) => Promise.reject(error)
// )

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

// ===============================
// CouponService Methods
// ===============================
const CouponService = {
    // ----------------
    // Admin
    // ----------------
    createCoupon: (data) =>
        axiosInstance.post('/createCoupon', data).then((res) => res.data),
    createCoupon2: (data) =>
        axiosInstance.post('/createCoupon2', data).then((res) => res.data),
    getAllCouponsAdmin: () =>
        axiosInstance.get('/getAllCoupons').then((res) => res.data),
    updateCoupon: (id, data) =>
        axiosInstance.put(`/updateCoupon/${id}`, data).then((res) => res.data),
    getCouponAnalytics: () =>
        axiosInstance.get('/analytics').then((res) => res.data),
    getRedemptionHistory: (id, params) =>
        axiosInstance
            .get(`/getRedemptionHistory/${id}/redemptions`, { params })
            .then((res) => res.data),

    // ----------------
    // User
    // ----------------
    getMyCoupons: (params) =>
        axiosInstance.get('/getmycoupons', { params }).then((res) => res.data),
    getCouponById: (id) =>
        axiosInstance.get(`/getCouponById/${id}`).then((res) => res.data),
    claimCoupon: (id) =>
        axiosInstance.post(`/claimCoupon/${id}/claim`).then((res) => res.data),

    // ----------------
    // Store Staff
    // ----------------
    validateCoupon: (data) =>
        axiosInstance.post('/validate', data).then((res) => res.data),
    validateForStaff: (data) =>
        axiosInstance.post('/validateForStaff', data).then((res) => res.data),
    redeemCoupon: (data) =>
        axiosInstance.post('/redeem', data).then((res) => res.data),
}

export default CouponService
