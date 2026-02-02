import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const initializeApplication = createAsyncThunk(
    'auth/initializeApplication',
    async (_, thunkAPI) => {
        try {
            const onboarding = await AsyncStorage.getItem(
                'onboarding_completed'
            )
            const token = await AsyncStorage.getItem('user_token') // Adjust key to match your app
            const hasCompletedOnboarding = onboarding === 'true'
            const isLoggedIn = !!token

            return { hasCompletedOnboarding, isLoggedIn }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// ... (Other thunks like signupSendOTP)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        isLoading: false, // UI loading for buttons
        isAppReady: false, // Global app initialization flag
        hasCompletedOnboarding: null,
        tempToken: null,
        userData: null,
        error: null,
    },
    reducers: {
        setTempToken: (state, action) => {
            state.tempToken = action.payload
        },
        resetAuthState: (state) => {
            state.error = null
            state.isLoading = false
        },
    },
    extraReducers: (builder) => {
        builder
            // Initialize App
            .addCase(initializeApplication.pending, (state) => {
                state.isAppReady = false
            })
            .addCase(initializeApplication.fulfilled, (state, action) => {
                state.isAppReady = true
                state.isLoggedIn = action.payload.isLoggedIn
                state.hasCompletedOnboarding =
                    action.payload.hasCompletedOnboarding
            })
            .addCase(initializeApplication.rejected, (state) => {
                state.isAppReady = true // Still ready, just failed
                state.hasCompletedOnboarding = false
            })
            // Signup Flow
            .addCase(signupSendOTP.pending, (state) => {
                state.isLoading = true
            })
            .addCase(signupSendOTP.fulfilled, (state, action) => {
                state.isLoading = false
                // Important: Do NOT set isLoggedIn = true here
            })
            .addCase(signupSendOTP.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    },
})

export const { setTempToken, resetAuthState } = authSlice.actions
export default authSlice.reducer

