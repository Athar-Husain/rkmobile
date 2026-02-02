import axios from 'axios'
import { TokenManager } from '../../../utils/tokenManager'
// import { TokenManager } from '../utils/tokenManager'

const BASE_API_URL = process.env.EXPO_PUBLIC_BACKEND_URL
const DEVICE_URL = `${BASE_API_URL}/api/auth`

const axiosInstance = axios.create({
    baseURL: DEVICE_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

const DeviceService = {
    registerDevice: (data) =>
        axiosInstance.post('/register-device', data).then((r) => r.data),
}

export default DeviceService
