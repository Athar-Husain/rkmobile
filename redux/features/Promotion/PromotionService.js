import axios from 'axios'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { BASE_API_URL } from '../../../utils/baseurl'

const PROMOTION_URL = `${BASE_API_URL}/api/promotion`

// ===============================
// Axios Instance
// ===============================
const axiosInstance = axios.create({
    baseURL: PROMOTION_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    config.headers['X-Device-Platform'] = Platform.OS
    return config
})

// ===============================
// PromotionService Methods
// ===============================
const PromotionService = {
    // ----------------
    // User Routes
    // ----------------
    fetchActivePromotions: (params) =>
        axiosInstance.get('/getactive', { params }).then((res) => res.data),

    fetchPromotionsForUser: (params) =>
        axiosInstance
            .get('/getPromotionsForUser', { params })
            .then((res) => res.data),

    recordImpression: (id) =>
        axiosInstance
            .post(`/recordPromotionImpression/${id}/impression`)
            .then((res) => res.data),

    recordClick: (id) =>
        axiosInstance
            .post(`/recordPromotionClick/${id}/click`)
            .then((res) => res.data),

    recordRedemption: (id) =>
        axiosInstance
            .post(`/recordPromotionRedemption/${id}/redeem`)
            .then((res) => res.data),

    // ----------------
    // Admin Routes
    // ----------------
    createPromotion: (data) =>
        axiosInstance.post('/createPromotion', data).then((res) => res.data),

    getAllPromotions: (params) =>
        axiosInstance
            .get('/getAllPromotions', { params })
            .then((res) => res.data),

    getPromotionById: (id) =>
        axiosInstance.get(`/getPromotionById/${id}`).then((res) => res.data),

    updatePromotion: (id, data) =>
        axiosInstance
            .put(`/updatePromotion/${id}`, data)
            .then((res) => res.data),

    deletePromotion: (id) =>
        axiosInstance.delete(`/deletePromotion/${id}`).then((res) => res.data),
}

export default PromotionService
