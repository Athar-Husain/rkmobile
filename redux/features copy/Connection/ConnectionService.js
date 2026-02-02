import axios from 'axios'
import { BASE_API_URL } from '../../../utils/baseurl.js'
import { TokenManager } from '../Customers/CustomerService'

const CONNECTION_URL = `${BASE_API_URL}/api/connections`

const axiosInstance = axios.create({
    baseURL: CONNECTION_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Attach token to every request if valid
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

const ConnectionService = {
    getAll: () => axiosInstance.get('/').then((res) => res.data),
    getById: (id) => axiosInstance.get(`/${id}`).then((res) => res.data),
    create: (data) => axiosInstance.post('/', data).then((res) => res.data),
    update: (id, data) =>
        axiosInstance.patch(`/${id}`, data).then((res) => res.data),
    deactivate: (id) =>
        axiosInstance.patch(`/${id}/deactivate`).then((res) => res.data),
    delete: (id) => axiosInstance.delete(`/${id}`).then((res) => res.data),
    getFiltered: (filters) => {
        const queryParams = new URLSearchParams(filters).toString()
        return axiosInstance
            .get(`/filter?${queryParams}`)
            .then((res) => res.data)
    },
    updateSubscribedPlan: (planData) =>
        axiosInstance.post('/subscribe-plan', planData).then((res) => res.data),
    getSubscribedPlans: (connectionId) =>
        axiosInstance
            .get(`/${connectionId}/subscribed-plans`)
            .then((res) => res.data),

    getConnectionsForUser: () =>
        axiosInstance.get('/myConnections').then((res) => res.data), // For logged-in user's connections

    getActiveConnection: () =>
        axiosInstance.get('/activeconnection').then((res) => res.data), // For logged-in user's connections
}

export default ConnectionService
