import axios from 'axios'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { BASE_API_URL } from '../../../utils/baseurl'

const PURCHASE_URL = `${BASE_API_URL}/api/purchase`

const axiosInstance = axios.create({
    baseURL: PURCHASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

// Attach token automatically
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await TokenManager.getToken()
        if (token) config.headers.Authorization = `Bearer ${token}`
        config.headers['X-Device-Platform'] = Platform.OS
        return config
    },
    (error) => Promise.reject(error)
)

const PurchaseService = {
    // ==========================
    // USER
    // ==========================
    getMyPurchases: () =>
        axiosInstance.get('/getMyPurchases').then((res) => res.data),

    getMyRecordedPurchases: () =>
        axiosInstance.get('/getMyRecordedPurchases').then((res) => res.data),

    getPurchaseById: (id) =>
        axiosInstance.get(`/getPurchaseById/${id}`).then((res) => res.data),

    addRating: (id, data) =>
        axiosInstance
            .post(`/addRating/${id}/rating`, data)
            .then((res) => res.data),

    updateFeedback: (id, data) =>
        axiosInstance
            .patch(`/updateFeedback/${id}/feedback`, data)
            .then((res) => res.data),

    // ==========================
    // STAFF POS
    // ==========================
    previewPurchase: (data) =>
        axiosInstance.post('/previewPurchase', data).then((res) => res.data),

    recordPurchase: (data) =>
        axiosInstance.post('/recordPurchase', data).then((res) => res.data),

    getStorePurchases: (storeId) =>
        axiosInstance.get(`/store/${storeId}`).then((res) => res.data),

    updatePurchaseStatus: (id, data) =>
        axiosInstance
            .patch(`/updatePurchaseStatus/${id}/status`, data)
            .then((res) => res.data),

    cancelPurchase: (id, data) =>
        axiosInstance
            .patch(`/cancelPurchase/${id}/cancel`, data)
            .then((res) => res.data),

    // ==========================
    // REPORTS
    // ==========================
    getStoreSalesReport: (storeId) =>
        axiosInstance.get(`/report/store/${storeId}`).then((res) => res.data),

    getUserSpendingReport: (userId) =>
        axiosInstance.get(`/report/user/${userId}`).then((res) => res.data),

    // ==========================
    // ADMIN
    // ==========================
    getAllPurchases: () =>
        axiosInstance.get('/getAllPurchases').then((res) => res.data),

    refundPurchase: (id, data) =>
        axiosInstance
            .patch(`/refundPurchase/${id}/refund`, data)
            .then((res) => res.data),

    deletePurchase: (id) =>
        axiosInstance.delete(`/deletePurchase/${id}`).then((res) => res.data),

    exportPurchases: () =>
        axiosInstance.get('/export', { responseType: 'blob' }),
}

export default PurchaseService
