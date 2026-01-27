import axios from 'axios';

// ===============================
// Configuration
// ===============================
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const ADMIN_URL = `${BASE_API_URL}/api/admin`;

// ===============================
// Axios Instance
// ===============================
const axiosInstance = axios.create({
  baseURL: ADMIN_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ===============================
// Token Management Utility
// ===============================
export const TokenManager = {
  save: (token, expiresInSeconds) => {
    const expiryTime = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_expiry', expiryTime.toString());
  },
  clear: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiry');
  },
  getToken: () => localStorage.getItem('access_token'),
  isValid: () => {
    const expiry = localStorage.getItem('token_expiry');
    return expiry && Date.now() < parseInt(expiry, 10);
  }
};

// ===============================
// Axios Interceptor
// ===============================
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

// ===============================
// AdminService Methods
// ===============================
const AdminService = {
  AdminRegister: (data) => axios.post(`${ADMIN_URL}/AdminRegister`, data).then((res) => res.data),

  AdminLogin: async (data) => {
    const response = await axios.post(`${ADMIN_URL}/AdminLogin`, data);
    const { token, expiresIn } = response.data;

    if (token && expiresIn) {
      TokenManager.save(token, expiresIn);
    }

    return response.data;
  },

  AdminLogout: () => {
    TokenManager.clear();
    return 'Logout successful';
  },

  forgotPassword: (email) => axios.post(`${ADMIN_URL}/forgotPassword`, { email }).then((res) => res.data),

  verifyOtp: (data) => axios.post(`${ADMIN_URL}/verifyOtp`, data).then((res) => res.data),

  changePassword: (data) => axiosInstance.patch('/changePassword', data).then((res) => res.data),

  getAdminLoginStatus: () => axiosInstance.get('/getAdminLoginStatus').then((res) => res.data),

  getAdmin: () => axiosInstance.get('/getAdmin').then((res) => res.data.admin),

  updateAdmin: (data) => axiosInstance.put('/updateAdmin', data).then((res) => res.data.admin)
};

export default AdminService;
