import axios from 'axios'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { BASE_API_URL } from '../../../utils/baseurl'

const COUPON_URL = `${BASE_API_URL}/api/coupons`

const axiosInstance = axios.create({
    baseURL: COUPON_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    config.headers['X-Device-Platform'] = Platform.OS
    return config
})

const CouponService = {
    // USER - 3 TAB SYSTEM
    getDiscoverableCoupons: () =>
        axiosInstance.get('/getDiscoverableCoupons').then((res) => res.data),

    getActiveCoupons: () =>
        axiosInstance.get('/getmyactivecoupons').then((res) => res.data),

    getCouponHistory: () =>
        axiosInstance.get('/getMyCouponHistory').then((res) => res.data),

    getCouponSavings: () =>
        axiosInstance.get('/getMyCouponSavings').then((res) => res.data),

    claimCoupon: (id) =>
        axiosInstance.post(`/claimCoupon/${id}/claim`).then((res) => res.data),

    // STAFF
    validateForStaff: (data) =>
        axiosInstance.post('/validateForStaff', data).then((res) => res.data),

    redeemCoupon: (data) =>
        axiosInstance.post('/redeem', data).then((res) => res.data),

    // ADMIN
    createCoupon: (data) =>
        axiosInstance.post('/createCoupon', data).then((res) => res.data),

    getAllCouponsAdmin: () =>
        axiosInstance.get('/getAllCoupons').then((res) => res.data),
}

export default CouponService
