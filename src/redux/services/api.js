import axios from 'axios'

const API_BASE_URL = 'YOUR_API_BASE_URL' // Replace with your API base URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') // Or use AsyncStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token')
            window.location.href = '/login' // Or navigate to login screen
        }
        return Promise.reject(error)
    }
)

export default api
