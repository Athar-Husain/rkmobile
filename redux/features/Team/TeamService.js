// src/features/team/TeamService.js

import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const TEAM_URL = `${BASE_API_URL}/api/team`;

// Create a reusable axios instance for team-related requests
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
const TeamService = {
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
  delete: (id) => axiosInstance.delete(`/${id}`).then((res) => res.data),

  /**
   * Initiates the forgot password process by sending an OTP.
   * @param {string} email - The email address of the team member.
   * @returns {Promise<Object>} The response containing OTP sent success message.
   */
  forgotPassword: (email) => axiosInstance.post('/forgotPassword', { email }).then((res) => res.data),

  /**
   * Verifies the OTP for password reset.
   * @param {string} email - The email address of the team member.
   * @param {string} otp - The OTP to verify.
   * @returns {Promise<Object>} The response containing OTP verification success message.
   */
  verifyOtp: (email, otp) => axiosInstance.post('/verifyOtp', { email, otp }).then((res) => res.data)
};

export default TeamService;
