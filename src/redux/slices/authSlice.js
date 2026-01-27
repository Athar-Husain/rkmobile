import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../services/authService'

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.signup(userData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await authService.verifyOTP(otpData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.logout()
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        otpSent: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setToken: (state, action) => {
            state.token = action.payload
            state.isAuthenticated = true
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAuthenticated = true
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false
                state.otpSent = true
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAuthenticated = true
                state.otpSent = false
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
                state.otpSent = false
            })
    },
})

export const { clearError, setToken } = authSlice.actions
export default authSlice.reducer
