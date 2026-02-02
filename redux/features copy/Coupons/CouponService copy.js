import axios from 'axios'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { BASE_API_URL } from '../../../utils/baseurl'

const COUPON_URL = `${BASE_API_URL}/api/coupons`

const axiosInstance = axios.create({
    baseURL: COUPON_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor for Auth and Device Headers
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

const CouponService = {
    // ADMIN ENDPOINTS
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

    // USER ENDPOINTS
    getMyCoupons: (params) =>
        axiosInstance.get('/getmycoupons', { params }).then((res) => res.data),

    getCouponById: (id) =>
        axiosInstance.get(`/getCouponById/${id}`).then((res) => res.data),

    claimCoupon: (id) =>
        axiosInstance.post(`/claimCoupon/${id}/claim`).then((res) => res.data),

    // STAFF ENDPOINTS
    validateCoupon: (data) =>
        axiosInstance.post('/validate', data).then((res) => res.data),

    // Specifically for Staff validation via QR/Manual Code
    validateForStaff: (data) =>
        axiosInstance.post('/validateForStaff', data).then((res) => res.data),

    redeemCoupon: (data) =>
        axiosInstance.post('/redeem', data).then((res) => res.data),
}

export default CouponService
