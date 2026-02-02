import axios from 'axios'
import { BASE_API_URL } from '../../../utils/baseurl.js'
import { TokenManager } from '../../../utils/tokenManager.js'
// import { TokenManager } from '../Customers/CustomerService'

// const BASE_API_URL = import.meta.env.VITE_BACKEND_URL
const TICKET_URL = `${BASE_API_URL}/api/tickets`

const axiosInstance = axios.create({
    baseURL: TICKET_URL,
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

const TicketService = {
    // 🎟️ Create tickets
    create: (data) => axiosInstance.post('/', data).then((res) => res.data),
    createInternal: (data) =>
        axiosInstance.post('/internal', data).then((res) => res.data),
    createFlexible: (data) =>
        axiosInstance.post('/dum', data).then((res) => res.data),

    // 🧾 Get tickets
    getAll: (query = '') =>
        axiosInstance.get(`/?${query}`).then((res) => res.data),
    getRecent: () => axiosInstance.get('/recent').then((res) => res.data),
    getById: (id) =>
        axiosInstance.get(`/getTicketById/${id}`).then((res) => res.data),

    // 👤 Customer-based tickets
    getByCustomer: (customerId) =>
        axiosInstance.get(`/?customer=${customerId}`).then((res) => res.data),

    // ✏️ Update + Delete
    update: (id, data) =>
        axiosInstance.patch(`/${id}`, data).then((res) => res.data),
    delete: (id) => axiosInstance.delete(`/${id}`).then((res) => res.data),

    // 👨‍💼 Assign / Reassign
    assign: (id, data) =>
        axiosInstance.post(`/${id}/assign`, data).then((res) => res.data),

    // 🚨 Escalate / Resolve
    escalate: (id) =>
        axiosInstance.post(`/${id}/escalate`).then((res) => res.data),
    resolve: (id, data) =>
        axiosInstance.post(`/${id}/resolve`, data).then((res) => res.data),

    // 📦 Bulk operations
    bulkUpdate: (payload) =>
        axiosInstance.post('/bulk-update', payload).then((res) => res.data),

    // 💬 Comments
    addPublicComment: (ticketId, data) =>
        axiosInstance.post(`/${ticketId}/public`, data).then((res) => res.data),

    getPublicComments: (ticketId) =>
        axiosInstance.get(`/${ticketId}/public`).then((res) => res.data),

    //   getPublicComments: (ticketId) => axiosInstance.get(`/${ticketId}/public`).then((res) => res.data),
    addPrivateComment: (ticketId, data) =>
        axiosInstance
            .post(`/${ticketId}/private`, data)
            .then((res) => res.data),
    getPrivateComments: (ticketId) =>
        axiosInstance.get(`/${ticketId}/private`).then((res) => res.data),

    // 📎 Attachments
    addAttachmentToTicket: (ticketId, formData) =>
        axiosInstance
            .post(`/${ticketId}/attachment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => res.data),

    addAttachmentToComment: (commentId, formData) =>
        axiosInstance
            .post(`/comment/${commentId}/attachment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => res.data),

    getTicketsForUser: () =>
        axiosInstance.get('/mytickets').then((res) => res.data),
}
// console.log("getTicketsForUser", getTicketsForUser)

export default TicketService
