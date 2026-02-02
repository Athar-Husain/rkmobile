// import TokenManager from './utils/TokenManager'; // Import TokenManager

// import TokenManager from "utils/TokenManager";
import TokenManager from '../../../utils/TokenManager';

const ADMIN_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;

// Use the getAxiosInstance to get the Axios instance with the interceptor attached
const axiosInstance = TokenManager.getAxiosInstance();

const AdminService = {
  AdminRegister: (data) => axiosInstance.post(`${ADMIN_URL}/AdminRegister`, data).then((res) => res.data),

  AdminLogin: async (data) => {
    const response = await axiosInstance.post(`${ADMIN_URL}/AdminLogin`, data);
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

  forgotPassword: (email) => axiosInstance.post(`${ADMIN_URL}/forgotPassword`, { email }).then((res) => res.data),

  verifyOtp: (data) => axiosInstance.post(`${ADMIN_URL}/verifyOtp`, data).then((res) => res.data),

  changePassword: (data) => axiosInstance.patch('/changePassword', data).then((res) => res.data),

  getAdminLoginStatus: () => axiosInstance.get('/getAdminLoginStatus').then((res) => res.data),

  getAdmin: () => axiosInstance.get('/getAdmin').then((res) => res.data.admin),

  updateAdmin: (data) => axiosInstance.put('/updateAdmin', data).then((res) => res.data.admin)
};

export default AdminService;
