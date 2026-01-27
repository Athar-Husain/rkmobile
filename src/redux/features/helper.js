// utils/errorHandler.js
import { toast } from 'react-toastify';

export const handleThunkError = (error, thunkAPI) => {
  const message = (error.response && error.response.data && error.response.data.error) || error.message || 'An unexpected error occurred';

  toast.error(message);
  return thunkAPI.rejectWithValue(message);
};

// Utility function to get token and set Authorization header
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please login first.');
  }
  return { Authorization: `Bearer ${token}` };
};
