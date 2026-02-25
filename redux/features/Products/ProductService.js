import axios from 'axios'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'
import { BASE_API_URL } from '../../../utils/baseurl'
const PRODUCT_URL = `${BASE_API_URL}/api/products`

// ===============================
// Axios Instance
// ===============================
const axiosInstance = axios.create({
    baseURL: PRODUCT_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    config.headers['X-Device-Platform'] = Platform.OS
    return config
})

// ===============================
// ProductService Methods
// ===============================
const ProductService = {
    // ----------------
    // Public
    // ----------------
    getProducts: (params) =>
        axiosInstance.get('/getProducts', { params }).then((res) => res.data),

    getFeaturedProducts: () =>
        axiosInstance.get('/getFeaturedProducts').then((res) => res.data),
    getCategoriesList: () =>
        axiosInstance.get('/getCategoriesList').then((res) => res.data),

    searchProducts: (query, params) =>
        axiosInstance
            .get(`/search/${query}`, { params })
            .then((res) => res.data),

    getProductsByCategory: (category, params) =>
        axiosInstance
            .get(`/category/${category}`, { params })
            .then((res) => res.data),

    getProductById: (id) =>
        axiosInstance.get(`/getProductById/${id}`).then((res) => res.data),

    checkAvailability: (id, params) =>
        axiosInstance
            .get(`/checkAvailability/${id}/availability`, { params })
            .then((res) => res.data),

    compareProducts: (data) =>
        axiosInstance.post('/compare', data).then((res) => res.data),

    addProduct: (data) =>
        axiosInstance.post('/addproduct', data).then((res) => res.data),

    updateProduct: (id, data) =>
        axiosInstance
            .patch(`/updateProduct/${id}`, data)
            .then((res) => res.data),
}

export default ProductService
