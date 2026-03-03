import axios from 'axios'
import { BASE_API_URL } from '../../../utils/baseurl.js'
import { TokenManager } from '../../../utils/tokenManager'

const HOME_URL = `${BASE_API_URL}/api/home`

const axiosInstance = axios.create({
    baseURL: HOME_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
})

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await TokenManager.getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

const HomeService = {
    // Main dashboard (combined)
    getDashboard: async () => {
        const response = await axiosInstance.get('/dashboard')
        return response.data
    },

    // User-specific routes
    getActivePromotions: async () => {
        const response = await axiosInstance.get('/user/active-promotions')
        // console.log("getActivePromotions response", response)
        return response.data
    },

    getFeaturedPromotions: async () => {
        const response = await axiosInstance.get('/user/featured-promotions')
        return response.data
    },

    getActiveBanners: async () => {
        const response = await axiosInstance.get('/user/active-banners')
        return response.data
    },

    getFeaturedBanners: async () => {
        const response = await axiosInstance.get('/user/featured-banners')
        return response.data
    },
}

export default HomeService
