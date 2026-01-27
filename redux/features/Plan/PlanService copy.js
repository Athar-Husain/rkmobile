// src/features/plan/PlanService.js

import axios from 'axios'
// import { TokenManager } from '../Admin/adminService'
import { TokenManager } from '../Customers/CustomerService'
import { BASE_API_URL } from '../../../utils/baseurl.js'

// const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const PLAN_URL = `${BASE_API_URL}/api/plans`

const axiosInstance = axios.create({
    baseURL: PLAN_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await TokenManager.getToken() // AsyncToken management
        const isValid = await TokenManager.isValid()
        if (token && isValid) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

const PlanService = {
    // ----------- Plans -----------
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

    // ----------- Subscriptions -----------
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

    // ----------- Plan Categories -----------
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
