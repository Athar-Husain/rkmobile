import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import AdminService from './adminService';

// ================================
// Initial State
// ================================
const token = localStorage.getItem('access_token');
const tokenExpiry = localStorage.getItem('token_expiry');

const initialState = {
  Admin: null,
  isLoggedIn: !!(token && tokenExpiry && Date.now() < +tokenExpiry),
  // isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// ================================
// Helper: Extract error messages
// ================================
const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong';

// ================================
// Async Thunks
// ================================

export const AdminRegister = createAsyncThunk('admin/register', async (userData, thunkAPI) => {
  try {
    return await AdminService.AdminRegister(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const AdminLogin = createAsyncThunk('admin/login', async (credentials, thunkAPI) => {
  try {
    const response = await AdminService.AdminLogin(credentials);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const AdminLogout = createAsyncThunk('admin/logout', async () => {
  return AdminService.AdminLogout();
});

export const getAdminLoginStatus = createAsyncThunk('admin/status', async (_, thunkAPI) => {
  try {
    return await AdminService.getAdminLoginStatus();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getAdmin = createAsyncThunk('admin/get', async (_, thunkAPI) => {
  try {
    return await AdminService.getAdmin();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateAdmin = createAsyncThunk('admin/update', async (data, thunkAPI) => {
  try {
    return await AdminService.updateAdmin(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk('admin/forgotPassword', async (email, thunkAPI) => {
  try {
    return await AdminService.forgotPassword(email);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const verifyOtp = createAsyncThunk('admin/verifyOtp', async (data, thunkAPI) => {
  try {
    return await AdminService.verifyOtp(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const changePassword = createAsyncThunk('admin/changePassword', async (data, thunkAPI) => {
  try {
    return await AdminService.changePassword(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// ================================
// Slice
// ================================
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    ADRESET: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // ====================
      // Register Admin
      // ====================
      .addCase(AdminRegister.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AdminRegister.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success('Admin registered successfully');
      })
      .addCase(AdminRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // ====================
      // Login Admin
      // ====================
      .addCase(AdminLogin.pending, (state) => {
        state.isLoading = true;
      })
      // .addCase(AdminLogin.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   state.isLoggedIn = true;
      //   state.Admin = action.payload;
      //   toast.success('Login successful');
      // })
      .addCase(AdminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.Admin = action.payload.admin; // Adjust if your payload wraps admin data
        // Store token and expiry from response
        localStorage.setItem('access_token', action.payload.token);
        localStorage.setItem('token_expiry', Date.now() + action.payload.expiresIn * 1000); // expiresIn in seconds?
        toast.success('Login successful');
      })
      .addCase(AdminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isLoggedIn = false;
        state.Admin = null;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // ====================
      // Logout Admin
      // ====================
      .addCase(AdminLogout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.Admin = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiry');
        toast.info('Logged out');
      })

      // ====================
      // Get Admin Login Status
      // ====================
      .addCase(getAdminLoginStatus.pending, (state) => {
        state.isLoading = true;
        // console.log('Login status pending:');
      })
      .addCase(getAdminLoginStatus.fulfilled, (state, action) => {
        // console.log('Login status:', action.payload);
        state.isLoading = false;
        state.isLoggedIn = action.payload;
      })
      .addCase(getAdminLoginStatus.rejected, (state, action) => {
        state.isLoading = false;
        // console.log('Login status rejected:');
        state.isLoggedIn = false;
        state.Admin = null;
        state.isError = true;
        state.message = action.payload;
        if (action.payload.includes('jwt expired')) {
          state.isLoggedIn = false;
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_expiry');
          toast.info('Session Expires Please Login', {
            position: 'top-center' // Position the toast at the top center
          });
        }

        // toast.info('Session expired. Please login again.');
        // localStorage.removeItem('access_token');
        // localStorage.removeItem('token_expiry');
      })

      // ====================
      // Get Admin
      // ====================
      .addCase(getAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.Admin = action.payload;
        state.isLoggedIn = true;
        state.isSuccess = true;
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(action.payload);
      })

      // ====================
      // Update Admin
      // ====================
      .addCase(updateAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Admin = action.payload;
        state.isSuccess = true;
        toast.success('Profile updated successfully');
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(action.payload);
      })

      // ====================
      // Forgot Password
      // ====================
      .addCase(forgotPassword.fulfilled, (_, action) => {
        toast.success(action.payload.message || 'OTP sent to email');
      })
      .addCase(forgotPassword.rejected, (_, action) => {
        toast.error(action.payload);
      })

      // ====================
      // Verify OTP
      // ====================
      .addCase(verifyOtp.fulfilled, (_, action) => {
        toast.success(action.payload.message || 'OTP verified');
      })
      .addCase(verifyOtp.rejected, (_, action) => {
        toast.error(action.payload);
      })

      // ====================
      // Change Password
      // ====================
      .addCase(changePassword.fulfilled, (_, action) => {
        toast.success(action.payload.message || 'Password changed');
      })
      .addCase(changePassword.rejected, (_, action) => {
        toast.error(action.payload);
      });
  }
});

export const { ADRESET } = adminSlice.actions;
export default adminSlice.reducer;
