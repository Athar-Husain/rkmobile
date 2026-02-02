import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import AuthService from './AuthService'

/* -------------------- HELPERS -------------------- */
const errorMessage = (e) =>
    e?.response?.data?.message || e?.message || 'Something went wrong'

/* -------------------- THUNKS -------------------- */
export const signupSendOTP = createAsyncThunk(
    'auth/signupSendOTP',
    async (data, thunkAPI) => {
        try {
            return await AuthService.signupSendOTP(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const signupVerifyOTP = createAsyncThunk(
    'auth/signupVerifyOTP',
    async (data, thunkAPI) => {
        try {
            return await AuthService.signupVerifyOTP(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const signinSendOTP = createAsyncThunk(
    'auth/signinSendOTP',
    async (data, thunkAPI) => {
        try {
            return await AuthService.signinSendOTP(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const signinVerifyOTP = createAsyncThunk(
    'auth/signinVerifyOTP',
    async (data, thunkAPI) => {
        try {
            return await AuthService.signinVerifyOTP(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const logout = createAsyncThunk('auth/logout', async () => {
    await AuthService.logout()
})

export const getLoginStatus = createAsyncThunk(
    'auth/getLoginStatus',
    async (_, thunkAPI) => {
        try {
            return await AuthService.getLoginStatus()
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

/* -------------------- SLICE -------------------- */
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        tempToken: null, // store tempToken between sendOTP and verifyOTP
        isLoggedIn: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        setTempToken: (state, action) => {
            state.tempToken = action.payload
        },
        resetAuthState: (state) => {
            state.isLoading = false
            state.error = null
            state.tempToken = null
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------- SIGNUP ---------- */
            .addCase(signupSendOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.tempToken = action.payload.tempToken
                showMessage({
                    message: 'OTP sent to email and mobile',
                    type: 'success',
                })
            })
            .addCase(signupVerifyOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                state.tempToken = null
                showMessage({
                    message: 'Account created successfully',
                    type: 'success',
                })
            })
            /* ---------- SIGNIN ---------- */
            .addCase(signinVerifyOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                showMessage({ message: 'Login successful', type: 'success' })
            })
            /* ---------- LOGOUT ---------- */
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.isLoggedIn = false
                state.tempToken = null
            })
            /* ---------- LOGIN STATUS ---------- */
            .addCase(getLoginStatus.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
                state.user = action.payload.user || null
                state.isLoading = false
            })
            /* ---------- PENDING MATCHER ---------- */
            .addMatcher(
                (a) =>
                    a.type.startsWith('auth/') && a.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true
                    state.error = null
                }
            )
            /* ---------- REJECTED MATCHER ---------- */
            .addMatcher(
                (a) =>
                    a.type.startsWith('auth/') && a.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    state.error = action.payload
                    showMessage({ message: action.payload, type: 'danger' })
                }
            )
    },
})

export const { resetAuthState, setTempToken } = authSlice.actions
export default authSlice.reducer
