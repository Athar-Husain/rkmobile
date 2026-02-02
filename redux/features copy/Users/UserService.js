import axios from 'axios'
import { TokenManager } from '../../../utils/tokenManager'

const BASE_API_URL = process.env.EXPO_PUBLIC_BACKEND_URL
const USER_URL = `${BASE_API_URL}/api/auth`

const axiosInstance = axios.create({
    baseURL: USER_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

const UserService = {
    getDashboard: () =>
        axiosInstance.get('/dashboard').then((r) => r.data.dashboard),

    getProfile: () => axiosInstance.get('/profile').then((r) => r.data.user),

    updateProfile: (data) =>
        axiosInstance.put('/profile', data).then((r) => r.data.user),

    validateReferralCode: (code) =>
        axios.get(`${USER_URL}/referral/${code}`).then((r) => r.data),
}

export default UserService
