import axios from 'axios'
import { BASE_API_URL } from '../../../utils/baseurl.js'
import { TokenManager } from '../../../utils/tokenManager'

const HOME_URL = `${BASE_API_URL}/api/home`

const axiosInstance = axios.create({
    baseURL: HOME_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
})

// Optional interceptor to check auth, though public dashboard works without it.
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
    getDashboard: async () => {
        const response = await axiosInstance.get('/dashboard')
        return response.data
    },
}

export default HomeService
