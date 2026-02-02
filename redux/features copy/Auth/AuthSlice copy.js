import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import AuthService from './AuthService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TokenManager } from '../../../utils/tokenManager'
// import TokenManager from './TokenManager' // Ensure this is imported

/* -------------------- CONSTANTS -------------------- */
const AUTH_STORAGE_KEYS = {
    USER: 'user_data',
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    ONBOARDING: 'onboarding_completed',
    FCM_TOKEN: 'fcm_token',
}

/* -------------------- HELPERS -------------------- */
const errorMessage = (e) => {
    return e?.response?.data?.message || e?.message || 'Something went wrong.'
}

const saveUserToStorage = async (user) => {
    try {
        await AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user))
    } catch (error) {
        console.error('Error saving user to storage:', error)
    }
}

/* -------------------- ASYNC THUNKS -------------------- */

export const initializeApplication = createAsyncThunk(
    'auth/initializeApplication',
    async (_, thunkAPI) => {
        try {
            const [onboarding, token, userStr] = await Promise.all([
                AsyncStorage.getItem(AUTH_STORAGE_KEYS.ONBOARDING),
                TokenManager.getToken(),
                AsyncStorage.getItem(AUTH_STORAGE_KEYS.USER),
            ])

            return {
                hasCompletedOnboarding: onboarding === 'true',
                isLoggedIn: !!token,
                userData: userStr ? JSON.parse(userStr) : null,
                deviceId: await AsyncStorage.getItem('deviceId'),
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Init Failed')
        }
    }
)

export const signupSendOTP = createAsyncThunk(
    'auth/signupSendOTP',
    async (data, thunkAPI) => {
        try {
            const response = await AuthService.signupSendOTP(data)
            return response // Note: tempToken should be in this response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

/**
 * Signup - Verify OTP and create account
 */
export const signupVerifyOTP = createAsyncThunk(
    'auth/signupVerifyOTP',
    async (data, thunkAPI) => {
        try {
            const response = await AuthService.signupVerifyOTP(data)

            // Save user data
            if (response.user) {
                await saveUserToStorage(response.user)
            }

            // Show success message
            showMessage({
                message: 'Account created successfully!',
                type: 'success',
                duration: 3000,
            })

            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

/**
 * Signin - Send OTP
 */
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

/**
 * Signin - Verify OTP and login
 */
export const signinVerifyOTP = createAsyncThunk(
    'auth/signinVerifyOTP',
    async (data, thunkAPI) => {
        try {
            const response = await AuthService.signinVerifyOTP(data)

            // Save user data
            if (response.user) {
                await saveUserToStorage(response.user)
            }

            // Show success message
            showMessage({
                message: 'Login successful!',
                type: 'success',
                duration: 2000,
            })

            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

/**
 * Logout user
 */
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState()
        const fcmToken = state.auth.fcmToken

        await AuthService.logout(fcmToken)

        // Clear redux state
        thunkAPI.dispatch(resetAuthState())

        // Show logout message
        showMessage({
            message: 'Logged out successfully',
            type: 'info',
            duration: 2000,
        })

        return true
    } catch (e) {
        // Even if API logout fails, clear local state
        thunkAPI.dispatch(resetAuthState())
        await clearAuthStorage()

        return thunkAPI.rejectWithValue(errorMessage(e))
    }
})

/**
 * Refresh FCM token
 */
export const refreshFCMToken = createAsyncThunk(
    'auth/refreshFCMToken',
    async (_, thunkAPI) => {
        try {
            const token = await AuthService.updateFCMToken()
            return token
        } catch (e) {
            console.error('FCM Token Refresh Error:', e)
            return thunkAPI.rejectWithValue(null) // Silent fail for FCM
        }
    }
)

/**
 * Get user profile
 */
export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, thunkAPI) => {
        try {
            const user = await AuthService.getProfile()

            // Update stored user data
            await saveUserToStorage(user)

            return user
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

/**
 * Update user profile
 */
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data, thunkAPI) => {
        try {
            const response = await AuthService.updateProfile(data)

            // Update local user data
            const state = thunkAPI.getState()
            const updatedUser = { ...state.auth.user, ...response.user }
            await saveUserToStorage(updatedUser)

            showMessage({
                message: 'Profile updated successfully',
                type: 'success',
                duration: 2000,
            })

            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

/**
 * Validate referral code
 */
export const validateReferralCode = createAsyncThunk(
    'auth/validateReferralCode',
    async (code, thunkAPI) => {
        try {
            return await AuthService.validateReferralCode(code)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

/**
 * Mark onboarding as complete
 */
export const markOnboardingComplete = createAsyncThunk(
    'auth/markOnboardingComplete',
    async (_, thunkAPI) => {
        try {
            await AuthService.markOnboardingComplete()
            return true
        } catch (e) {
            return thunkAPI.rejectWithValue(
                'Failed to mark onboarding complete'
            )
        }
    }
)

/**
 * Reset onboarding
 */
export const resetOnboarding = createAsyncThunk(
    'auth/resetOnboarding',
    async (_, thunkAPI) => {
        try {
            await AuthService.resetOnboarding()
            return true
        } catch (e) {
            return thunkAPI.rejectWithValue('Failed to reset onboarding')
        }
    }
)

/**
 * Refresh auth token
 */
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, thunkAPI) => {
        try {
            return await AuthService.refreshToken()
        } catch (e) {
            // If refresh fails, log user out
            thunkAPI.dispatch(logout())
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

// ... (keep your other thunks like signupVerifyOTP, logout, etc. as they were)

/* -------------------- SLICE -------------------- */
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        tempToken: null,
        isLoggedIn: false,
        isLoading: false, // UI loading (buttons)

        isInitializing: true,
        isAppReady: false, // NEW: App boot status
        fcmToken: null,
        deviceId: null,
        hasCompletedOnboarding: null,
        error: null,

        // Metadata
        lastUpdated: null,
        loginTimestamp: null,
    },
    reducers: {
        setTempToken: (state, action) => {
            state.tempToken = action.payload
        },
        resetAuthState: (state) => {
            state.user = null
            state.tempToken = null
            state.isLoggedIn = false
            state.isLoading = false
            state.error = null
            state.fcmToken = null
            state.loginTimestamp = null
        },
        setFCMToken: (state, action) => {
            state.fcmToken = action.payload
        },

        setUser: (state, action) => {
            state.user = action.payload
            state.isLoggedIn = !!action.payload
            if (action.payload) {
                state.loginTimestamp = Date.now()
            }
        },

        clearError: (state) => {
            state.error = null
            state.lastError = null
        },

        updateUserField: (state, action) => {
            const { field, value } = action.payload
            if (state.user) {
                state.user[field] = value
                state.lastUpdated = Date.now()
            }
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------- INITIALIZE ---------- */
            .addCase(initializeApplication.pending, (state) => {
                state.isInitializing = true
                state.isAppReady = false
            })
            .addCase(initializeApplication.fulfilled, (state, action) => {
                state.isInitializing = false
                state.isLoading = false
                state.hasCompletedOnboarding =
                    action.payload.hasCompletedOnboarding
                state.isLoggedIn = action.payload.isLoggedIn
                state.user = action.payload.userData
                state.fcmToken = action.payload.fcmToken
                state.deviceId = action.payload.deviceId
                state.error = null
                state.isAppReady = true

                if (action.payload.isLoggedIn) {
                    state.loginTimestamp = Date.now()
                }
            })
            .addCase(initializeApplication.rejected, (state) => {
                state.isInitializing = false
                state.isAppReady = true
                state.hasCompletedOnboarding = false
                state.lastError = action.payload
            })

            /* ---------- SIGNUP ---------- */
            .addCase(signupSendOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.tempToken = action.payload.tempToken
                state.error = null
            })

            .addCase(signupVerifyOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                state.tempToken = null
                state.error = null
                state.loginTimestamp = Date.now()
            })

            /* ---------- SIGNIN ---------- */
            .addCase(signinVerifyOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                state.tempToken = null
                state.error = null
                state.loginTimestamp = Date.now()
            })

            /* ---------- LOGOUT ---------- */
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.isLoggedIn = false
                state.tempToken = null
                state.fcmToken = null
                state.loginTimestamp = null
                state.error = null
            })

            /* ---------- FCM TOKEN REFRESH ---------- */
            .addCase(refreshFCMToken.fulfilled, (state, action) => {
                if (action.payload) {
                    state.fcmToken = action.payload
                }
            })

            /* ---------- PROFILE ---------- */
            .addCase(getProfile.fulfilled, (state, action) => {
                state.user = action.payload
                state.lastUpdated = Date.now()
            })

            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload.user }
                state.lastUpdated = Date.now()
            })

            /* ---------- ONBOARDING ---------- */
            .addCase(markOnboardingComplete.fulfilled, (state) => {
                state.hasCompletedOnboarding = true
            })

            .addCase(resetOnboarding.fulfilled, (state) => {
                state.hasCompletedOnboarding = false
            })

            /* ---------- TOKEN REFRESH ---------- */
            .addCase(refreshToken.fulfilled, (state) => {
                state.error = null
            })

            /* ---------- GLOBAL MATCHERS ---------- */
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth/') &&
                    action.type.endsWith('/pending'),
                (state, action) => {
                    // Do NOT trigger isLoading for initialization, otherwise it flips the screen
                    if (!action.type.includes('initializeApplication')) {
                        state.isLoading = true
                    }
                    state.error = null
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    state.error = action.payload
                    if (!action.type.includes('refreshFCMToken')) {
                        showMessage({ message: action.payload, type: 'danger' })
                    }
                }
            )
    },
})

export const { setTempToken, resetAuthState } = authSlice.actions
export default authSlice.reducer
