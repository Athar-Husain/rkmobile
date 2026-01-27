// src/redux/features/Customers/CustomerService.js

import axios from 'axios'
import { BASE_API_URL } from '../../../utils/baseurl'
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging' // For FCM token

const CUSTOMER_URL = `${BASE_API_URL}/api/customers`

const axiosInstance = axios.create({
    baseURL: CUSTOMER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// ----------------------
// Token Manager
// ----------------------
export const TokenManager = {
    save: async (token, expiresInSeconds) => {
        const expiryTime = Date.now() + expiresInSeconds * 1000
        await AsyncStorage.setItem('access_token', token)
        await AsyncStorage.setItem('token_expiry', expiryTime.toString())
    },
    clear: async () => {
        await AsyncStorage.removeItem('access_token')
        await AsyncStorage.removeItem('token_expiry')
    },
    getToken: async () => {
        return await AsyncStorage.getItem('access_token')
    },
    isValid: async () => {
        const expiry = await AsyncStorage.getItem('token_expiry')
        return expiry && Date.now() < parseInt(expiry, 10)
    },
}

// Attach token to every request if valid
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await TokenManager.getToken()
        const isValid = await TokenManager.isValid()
        if (token && isValid) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Optional: Response interceptor to auto logout on 401
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await TokenManager.clear()
        }
        return Promise.reject(error)
    }
)

// ----------------------
// Customer Service
// ----------------------
const CustomerService = {
    register: (data) =>
        axiosInstance.post('/register', data).then((res) => res.data),

    login: async ({ email, password }) => {
        // Get FCM token automatically
        const fcmToken = await messaging().getToken()
        const response = await axiosInstance
            .post('/login', { email, password, fcmToken })
            .then((res) => res.data)
        return response
    },

    // login: async ({ email, password, fcmToken }) => {
    //     const response = await axiosInstance
    //         .post('/login', { email, password, fcmToken })
    //         .then((res) => res.data);
    //     return response;
    // },

    logout: async () => {
        const fcmToken = await messaging().getToken()
        const userId = await AsyncStorage.getItem('user_id') // optional, store userId on login
        const response = await axiosInstance
            .post('/logout', { userId, fcmToken })
            .then((res) => res.data)
        await TokenManager.clear()
        return response
    },

    getAll: () => axiosInstance.get('/all').then((res) => res.data),

    getProfile: () => axiosInstance.get('/profile').then((res) => res.data),

    update: (data) =>
        axiosInstance.patch('/update', data).then((res) => res.data),

    switchConnection: (data) =>
        axiosInstance.patch('/switchConnection', data).then((res) => res.data),

    forgotPassword: (email) =>
        axiosInstance
            .post('/forgot-password', { email })
            .then((res) => res.data),

    verifyOtp: (data) =>
        axiosInstance.post('/verify-otp', data).then((res) => res.data),

    changePassword: (data) =>
        axiosInstance.post('/change-password', data).then((res) => res.data),

    searchByPhone: (phone) =>
        axiosInstance.get(`/search?phone=${phone}`).then((res) => res.data),

    delete: (id) => axiosInstance.delete(`/${id}`).then((res) => res.data),

    TokenManager,
}

export default CustomerService
