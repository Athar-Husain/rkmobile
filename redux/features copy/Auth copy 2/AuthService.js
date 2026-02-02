import { BASE_API_URL } from '../../../utils/baseurl.js'
import axios from 'axios'
import { TokenManager } from '../../../utils/tokenManager'

const AUTH_URL = `${BASE_API_URL}/api/auth`

const axiosInstance = axios.create({
    baseURL: AUTH_URL,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await TokenManager.getToken()
    const valid = await TokenManager.isValid()

    if (token && valid) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

const AuthService = {
    /* ---------- SIGNUP ---------- */
    signupSendOTP: (data) =>
        axios.post(`${AUTH_URL}/signup/send-otp`, data).then((r) => r.data),

    signupVerifyOTP: async (data) => {
        const res = await axios.post(`${AUTH_URL}/signup/verify-otp`, data)
        const { token, expiresIn } = res.data
        if (token && expiresIn) await TokenManager.save(token, expiresIn)
        return res.data
    },

    /* ---------- SIGNIN ---------- */
    signinSendOTP: (data) =>
        axios.post(`${AUTH_URL}/signin/send-otp`, data).then((r) => r.data),

    signinVerifyOTP: async (data) => {
        const res = await axios.post(`${AUTH_URL}/signin/verify-otp`, data)
        const { token, expiresIn } = res.data
        if (token && expiresIn) await TokenManager.save(token, expiresIn)
        return res.data
    },

    /* ---------- PASSWORD ---------- */
    forgotPassword: (data) =>
        axios.post(`${AUTH_URL}/forgot-password`, data).then((r) => r.data),

    resetPassword: (data) =>
        axios.post(`${AUTH_URL}/reset-password`, data).then((r) => r.data),

    /* ---------- SESSION ---------- */
    logout: async () => {
        await axiosInstance.post('/logout')
        await TokenManager.clear()
        return true
    },

    getLoginStatus: () =>
        axiosInstance.get('/login-status').then((r) => r.data),
}

export default AuthService
