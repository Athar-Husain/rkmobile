// src/features/Area/AreaService.js

import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const SERVICE_AREA_URL = `${BASE_API_URL}/api/service-areas`;

const axiosInstance = axios.create({
  baseURL: `${SERVICE_AREA_URL}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

const AreaService = {
  // Create single service area
  create: (data) => axiosInstance.post('/', data).then((res) => res.data),

  // Get all service areas
  getAll: () => axiosInstance.get('/').then((res) => res.data),

  // Get active service areas
  getActive: () => axiosInstance.get('/active').then((res) => res.data),

  // Get service area by ID
  getById: (id) => axiosInstance.get(`/${id}`).then((res) => res.data),

  // Update service area
  update: (id, data) => axiosInstance.put(`/${id}`, data).then((res) => res.data),

  // Delete service area
  delete: (id) => axiosInstance.delete(`/${id}`).then((res) => res.data),

  // Toggle active/inactive status
  toggleStatus: (id) => axiosInstance.patch(`/${id}/toggle`).then((res) => res.data),

  // Search service areas
  search: (region) => axiosInstance.get(`/search?region=${region}`).then((res) => res.data),

  // Bulk create
  bulkCreate: (data) => axiosInstance.post('/bulk', { areas: data }).then((res) => res.data),

  // Paginated fetch
  getPaginated: ({ page = 1, limit = 10, isActive }) =>
    axiosInstance
      .get('/paginated', {
        params: { page, limit, isActive }
      })
      .then((res) => res.data)
};

export default AreaService;
