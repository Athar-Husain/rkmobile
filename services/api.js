import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Create axios instance
const api = axios.create({
    baseURL: 'http://YOUR_API_URL/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        } catch (error) {
            console.error('Error getting token:', error)
        }

        // Add device info
        config.headers['X-Device-Platform'] = Platform.OS
        config.headers['X-App-Version'] = '1.0.0'

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken')
                if (!refreshToken) {
                    // No refresh token, force logout
                    await AsyncStorage.clear()
                    // Navigate to login screen (you'll need to handle this in your app)
                    return Promise.reject(error)
                }

                // Call refresh token endpoint
                const response = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh-token`,
                    { refreshToken }
                )

                if (response.data.success) {
                    const { token, refreshToken: newRefreshToken } =
                        response.data

                    // Store new tokens
                    await AsyncStorage.setItem('token', token)
                    await AsyncStorage.setItem('refreshToken', newRefreshToken)

                    // Update authorization header
                    originalRequest.headers.Authorization = `Bearer ${token}`

                    // Retry original request
                    return api(originalRequest)
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                await AsyncStorage.clear()
                // Navigate to login screen
                return Promise.reject(refreshError)
            }
        }

        // Handle other errors
        return Promise.reject(error)
    }
)

// Auth API methods
export const authAPI = {
    // Signup
    signup: (data) => api.post('/auth/signup', data),

    // Verify OTP
    verifyOTP: (data) => api.post('/auth/verify-otp', data),

    // Signin
    signin: (data) => api.post('/auth/signin', data),

    // Forgot password
    forgotPassword: (data) => api.post('/auth/forgot-password', data),

    // Reset password
    resetPassword: (data) => api.post('/auth/reset-password', data),

    // Resend OTP
    resendOTP: (data) => api.post('/auth/resend-otp', data),

    // Validate referral code
    validateReferral: (code) => api.get(`/auth/validate-referral/${code}`),

    // Get cities
    getCities: () => api.get('/auth/cities'),

    // Get areas by city
    getAreasByCity: (cityId) => api.get(`/auth/cities/${cityId}/areas`),

    // Search cities
    searchCities: (query) => api.get(`/auth/cities/search?query=${query}`),

    // Check availability
    checkAvailability: (data) =>
        api.post('/auth/cities/check-availability', data),
}

// Profile API methods
export const profileAPI = {
    // Get profile
    getProfile: () => api.get('/auth/profile'),

    // Update profile
    updateProfile: (data) => api.patch('/auth/profile', data),

    // Get login status
    getLoginStatus: () => api.get('/auth/login-status'),

    // Register device
    registerDevice: (data) => api.post('/auth/register-device', data),

    // Logout
    logout: (data) => api.post('/auth/logout', data),

    // Get dashboard
    getDashboard: () => api.get('/auth/dashboard'),
}

// Export default for direct use
export default api
