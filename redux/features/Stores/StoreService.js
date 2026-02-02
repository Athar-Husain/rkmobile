import axios from 'axios'
import { Platform } from 'react-native'
import { BASE_API_URL } from '../../../utils/baseurl'
import { TokenManager } from '../../../utils/tokenManager'

const STORE_URL = `${BASE_API_URL}/api/stores`

const axiosInstance = axios.create({
    baseURL: STORE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    config.headers['X-Device-Platform'] = Platform.OS
    return config
})

const StoreService = {
    // ========= PUBLIC =========
    getStores: (params) =>
        axiosInstance.get('/getStores', { params }).then((res) => res.data),

    getStoreById: (id) =>
        axiosInstance.get(`/getStoreById/${id}`).then((res) => res.data),

    getStoreHours: (id) =>
        axiosInstance.get(`/getStoreHours/${id}/hours`).then((res) => res.data),

    getNearbyStores: (params) =>
        axiosInstance.get('/nearby', { params }).then((res) => res.data),

    // ========= STAFF =========
    staffLogin: (data) =>
        axiosInstance.post('/staff-login', data).then((res) => {
            const { token, expiresIn } = res.data
            if (token && expiresIn) TokenManager.save(token, expiresIn)
            return res.data
        }),

    getDashboard: (id) =>
        axiosInstance.get(`/getStoreD/${id}/dashboard`).then((res) => res.data),

    // ========= ADMIN =========
    createStore: (data) =>
        axiosInstance.post('/createStore', data).then((res) => res.data),

    getAllStoresAdmin: () =>
        axiosInstance.get('/getAllStores').then((res) => res.data),

    getStoreByIdAdmin: (id) =>
        axiosInstance.get(`/getStoreById/${id}`).then((res) => res.data),

    updateStore: (id, data) =>
        axiosInstance.put(`/updateStore/${id}`, data).then((res) => res.data),

    toggleStoreStatus: (id) =>
        axiosInstance
            .patch(`/toggleStoreStatus/${id}/status`)
            .then((res) => res.data),
}

export default StoreService
