// src/features/team/TeamService.js

import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const TEAM_URL = `${BASE_API_URL}/api/team`;

// Create a reusable axios instance for team-related requests
// In a real-world app, this instance would be configured to attach
// an auth token automatically (e.g., from Redux state or local storage).
const axiosInstance = axios.create({
  baseURL: TEAM_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();

    if (token && TokenManager.isValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Service to handle all API interactions for Team management.
 * This object centralizes the logic for making requests,
 * keeping the Redux thunks clean and focused on state management.
 */
const TeamService2 = {
  /**
   * Registers a new team member.
   * @param {Object} data - The user data to register.
   * @returns {Promise<Object>} The registered team member object.
   */
  register: (data) => axiosInstance.post('/register', data).then((res) => res.data),

  /**
   * Fetches all team members.
   * @returns {Promise<Object>} An object containing the list of team members.
   */
  getAll: () => axiosInstance.get('/getAll').then((res) => res.data),

  /**
   * Fetches a single team member by their ID.
   * @param {string} id - The ID of the team member.
   * @returns {Promise<Object>} The team member object.
   */
  getById: (id) => axiosInstance.get(`/${id}`).then((res) => res.data),

  /**
   * Updates an existing team member's details.
   * @param {string} id - The ID of the team member to update.
   * @param {Object} data - The updated data.
   * @returns {Promise<Object>} The updated team member object.
   */
  update: (id, data) => axiosInstance.patch(`/${id}`, data).then((res) => res.data),

  /**
   * Updates a team member's password (admin-level).
   * @param {string} id - The ID of the team member.
   * @param {Object} data - The new password object.
   * @returns {Promise<string>} A success message.
   */
  updatePassword: (id, data) => axiosInstance.patch(`/${id}/password`, data).then((res) => res.data),

  /**
   * Deletes a team member.
   * @param {string} id - The ID of the team member to delete.
   * @returns {Promise<string>} A success message.
   */
  delete: (id) => axiosInstance.delete(`/${id}`).then((res) => res.data)
};




const TeamService = {
  register: async (data) => {
    const response = await axiosInstance.post('/register', data);
    return response.data;
  },

  getAll: async () => {
    const response = await axiosInstance.get('/getAll');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`/${id}`, data);
    return response.data;
  },

  updatePassword: async (id, data) => {
    const response = await axiosInstance.patch(`/${id}/password`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  }
};

export default TeamService;
