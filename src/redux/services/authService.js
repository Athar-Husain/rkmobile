import api from './api'

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/signin', credentials)
        return response.data
    },

    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData)
        return response.data
    },

    sendOTP: async (mobile) => {
        const response = await api.post('/auth/send-otp', { mobile })
        return response.data
    },

    verifyOTP: async (otpData) => {
        const response = await api.post('/auth/verify-otp', otpData)
        return response.data
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email })
        return response.data
    },

    resetPassword: async (resetData) => {
        const response = await api.post('/auth/reset-password', resetData)
        return response.data
    },

    logout: async () => {
        const response = await api.post('/auth/logout')
        return response.data
    },

    getDashboard: async () => {
        const response = await api.get('/auth/dashboard')
        return response.data
    },
}
