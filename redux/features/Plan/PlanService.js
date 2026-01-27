import axios from 'axios'
import { TokenManager } from '../Customers/CustomerService'
import { BASE_API_URL } from '../../../utils/baseurl.js'

const PLAN_URL = `${BASE_API_URL}/api/plans`

const axiosInstance = axios.create({
    baseURL: PLAN_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await TokenManager.getToken()
        const isValid = await TokenManager.isValid()
        if (token && isValid) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        // Handle request error (e.g. network issues)
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response, // If the response is successful, return it
    (error) => {
        // Handle different types of errors globally
        if (error.response) {
            // Server errors (5xx)
            console.error('Server Error:', error.response.data)
        } else if (error.request) {
            // No response received (Network issues)
            console.error('Network Error:', error.message)
        } else {
            // Other errors (e.g., invalid API call)
            console.error('Error:', error.message)
        }
        return Promise.reject(error)
    }
)

const PlanService = {
    // Plans Endpoints
    createPlan: (data) =>
        axiosInstance.post('/plans', data).then((res) => res.data),
    getAllPlans: () => axiosInstance.get('/plans').then((res) => res.data),
    getPlanById: (id) =>
        axiosInstance.get(`/plans/${id}`).then((res) => res.data),
    updatePlan: (id, data) =>
        axiosInstance.put(`/plans/${id}`, data).then((res) => res.data),
    deletePlan: (id) =>
        axiosInstance.delete(`/plans/${id}`).then((res) => res.data),
    getPlansByCriteria: (params) =>
        axiosInstance.get('/plans/search', { params }).then((res) => res.data),

    // Subscription Endpoints
    subscribeToPlan: (data) =>
        axiosInstance.post('/subscription/admin', data).then((res) => res.data),
    getCustomerCurrentPlan: () =>
        axiosInstance.get('/subscriptions/current').then((res) => res.data),
    renewSubscription: (data) =>
        axiosInstance
            .post('/subscriptions/renew', data)
            .then((res) => res.data),
    checkPlanExpiry: () =>
        axiosInstance
            .get('/subscriptions/check-expiry')
            .then((res) => res.data),

    // Plan Category Endpoints
    createPlanCategory: (data) =>
        axiosInstance.post('/categories', data).then((res) => res.data),
    getAllPlanCategories: () =>
        axiosInstance.get('/categories').then((res) => res.data),
    getPlanCategoryById: (id) =>
        axiosInstance.get(`/categories/${id}`).then((res) => res.data),
    updatePlanCategory: (id, data) =>
        axiosInstance.patch(`/categories/${id}`, data).then((res) => res.data),
    deletePlanCategory: (id) =>
        axiosInstance.delete(`/categories/${id}`).then((res) => res.data),
}

export default PlanService
