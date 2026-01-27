// regionService.js

import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const URL = `${BASE_API_URL}/api/serviceArea`;

const regionService = {
  // Add a new service area
  add: async (userData) => {
    const response = await axios.post(`${URL}/add`, userData);
    return response.data;
  },

  // Get all service areas
  getAll: async () => {
    const response = await axios.get(`${URL}/getAll`);
    return response.data;
  },

  // Get a service area by ID
  getById: async (id) => {
    const response = await axios.get(`${URL}/get/${id}`);
    return response.data;
  },

  // Update a service area
  update: async (id, userData) => {
    console.log("id and userData in service file ", id, userData)
    const response = await axios.put(`${URL}/${id}`, userData);
    return response.data;
  },

  // Delete a service area
  delete: async (id) => {
    const response = await axios.delete(`${URL}/${id}`);
    return response.data;
  }
};

export default regionService;
