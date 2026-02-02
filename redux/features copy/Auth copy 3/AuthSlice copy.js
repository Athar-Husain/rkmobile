import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import AuthService from './AuthService'
import AsyncStorage from '@react-native-async-storage/async-storage'

const errorMessage = (e) =>
    e?.response?.data?.message || e?.message || 'Something went wrong'

export const initializeApplication = createAsyncThunk(
    'auth/initializeApplication',
    async (_, thunkAPI) => {
        try {
            // Check onboarding status
            const onboardingCompleted = await AsyncStorage.getItem(
                'onboarding_completed'
            )
            const hasCompletedOnboarding = onboardingCompleted === 'true'

            // Check for a valid login token
            const isLoggedIn = await AuthService.TokenManager.isValid()

            let userData = null
            if (isLoggedIn) {
                userData = await AuthService.getProfile()
                // Update FCM token on app initialization
                await AuthService.updateFCMToken()
            } else {
                await AuthService.TokenManager.clear()
            }
            return { hasCompletedOnboarding, isLoggedIn, userData }
        } catch (error) {
            console.error('Failed to initialize app state', error)
            await AuthService.TokenManager.clear()
            return thunkAPI.rejectWithValue('App initialization failed.')
        }
    }
)

/* -------------------- THUNKS -------------------- */
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

/* -------------------- SLICE -------------------- */
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        tempToken: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
        hasCompletedOnboarding: null,
        fcmToken: null,
    },
    reducers: {
        setTempToken: (state, action) => {
            state.tempToken = action.payload
        },
        resetAuthState: (state) => {
            state.isLoading = false
            state.error = null
            state.tempToken = null
            state.user = null
            state.isLoggedIn = false
        },
        setFCMToken: (state, action) => {
            state.fcmToken = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
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
            .addCase(signinVerifyOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                showMessage({ message: 'Login successful', type: 'success' })
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.isLoggedIn = false
                state.tempToken = null
                state.fcmToken = null
            })
            .addCase(initializeApplication.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
                state.user = action.payload.userData
                state.hasCompletedOnboarding =
                    action.payload.hasCompletedOnboarding
                state.isLoading = false
            })
            .addMatcher(
                (a) =>
                    a.type.startsWith('auth/') && a.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true
                    state.error = null
                }
            )
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

export const { resetAuthState, setTempToken, setFCMToken } = authSlice.actions
export default authSlice.reducer
