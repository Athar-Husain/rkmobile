// redux/features/Auth/AuthSlice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import AuthService from './AuthService'
import AsyncStorage from '@react-native-async-storage/async-storage'

/* -------------------- CONSTANTS -------------------- */
const AUTH_STORAGE_KEYS = {
    USER: 'user_data',
    REFRESH_TOKEN: 'refresh_token',
    ONBOARDING: 'onboarding_completed',
}

/* -------------------- HELPERS -------------------- */
const errorMessage = (e) => {
    const message =
        e?.response?.data?.message || e?.message || 'Something went wrong.'
    return typeof message === 'string' ? message : 'Something went wrong.'
}

const saveUserToStorage = async (user) => {
    try {
        await AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user))
    } catch (error) {
        console.error('Error saving user to storage:', error)
    }
}

const clearAuthStorage = async () => {
    try {
        await AsyncStorage.multiRemove([
            AUTH_STORAGE_KEYS.USER,
            AUTH_STORAGE_KEYS.REFRESH_TOKEN,
            'fcm_token',
            'deviceId',
        ])
    } catch (error) {
        console.error('Error clearing auth storage:', error)
    }
}

// Safe showMessage wrapper
export const safeShowMessage = (config) => {
    try {
        // Ensure message is a string and not undefined
        const message = config.message || 'Operation completed'
        const type = config.type || 'info'

        if (typeof message === 'string' && message.trim()) {
            showMessage({
                message: message,
                type: type,
                duration: config.duration || 3000,
                floating: true,
                icon: config.icon || 'auto',
            })
        }
    } catch (error) {
        console.error('Error showing flash message:', error)
    }
}

/* -------------------- ASYNC THUNKS -------------------- */

export const initializeApplication = createAsyncThunk(
    'auth/initializeApplication',
    async (_, thunkAPI) => {
        try {
            // Get device ID first
            const deviceId =
                (await AsyncStorage.getItem('deviceId')) ||
                `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

            if (!(await AsyncStorage.getItem('deviceId'))) {
                await AsyncStorage.setItem('deviceId', deviceId)
            }

            // Check onboarding status
            const onboardingCompleted = await AsyncStorage.getItem(
                'onboarding_completed'
            )
            const hasCompletedOnboarding = onboardingCompleted === 'true'

            // Check if user is authenticated
            const isAuthenticated = await AuthService.isAuthenticated()

            let userData = null
            let fcmToken = null

            if (isAuthenticated) {
                try {
                    // Try to get fresh user data from API
                    const statusResponse = await AuthService.getLoginStatus()
                    userData = statusResponse.user

                    // Get stored user data as fallback
                    if (!userData) {
                        userData = await AuthService.getStoredUserData()
                    }

                    // Register/update FCM token in background (don't await)
                    AuthService.updateFCMToken().catch((err) =>
                        console.log(
                            'FCM registration during init failed:',
                            err.message
                        )
                    )
                } catch (apiError) {
                    console.log('API initialization error:', apiError.message)

                    // Use stored data if API fails
                    userData = await AuthService.getStoredUserData()

                    // If stored data is invalid, clear everything
                    if (!userData) {
                        await clearAuthStorage()
                    }
                }
            } else {
                // Clear any stale data
                await clearAuthStorage()
            }

            return {
                hasCompletedOnboarding,
                isLoggedIn: isAuthenticated && !!userData,
                userData,
                deviceId,
            }
        } catch (error) {
            console.error('Failed to initialize app state:', error)

            // Clear invalid data
            await clearAuthStorage()

            return thunkAPI.rejectWithValue({
                message:
                    'Failed to initialize application. Please restart the app.',
                code: 'INIT_FAILED',
            })
        }
    }
)

export const signupSendOTP = createAsyncThunk(
    'auth/signupSendOTP',
    async (data, thunkAPI) => {
        try {
            const response = await AuthService.signupSendOTP(data)
            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

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
            safeShowMessage({
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

export const signinSendOTP = createAsyncThunk(
    'auth/signinSendOTP',
    async (data, thunkAPI) => {
        try {
            const response = await AuthService.signinSendOTP(data)
            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

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
            safeShowMessage({
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

// ADD THESE MISSING THUNKS
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (data, thunkAPI) => {
        try {
            return await AuthService.forgotPassword(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data, thunkAPI) => {
        try {
            return await AuthService.resetPassword(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await AuthService.logout()

        // Show logout message
        safeShowMessage({
            message: 'Logged out successfully',
            type: 'info',
            duration: 2000,
        })

        return true
    } catch (e) {
        // Even if API logout fails, clear local state
        await clearAuthStorage()
        return thunkAPI.rejectWithValue(errorMessage(e))
    }
})

export const refreshFCMToken = createAsyncThunk(
    'auth/refreshFCMToken',
    async (_, thunkAPI) => {
        try {
            const token = await AuthService.updateFCMToken()
            return token
        } catch (e) {
            console.log('FCM Token Refresh Error:', e.message)
            return thunkAPI.rejectWithValue(null)
        }
    }
)

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, thunkAPI) => {
        try {
            const user = await AuthService.getProfile()
            await saveUserToStorage(user)
            return user
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data, thunkAPI) => {
        try {
            const response = await AuthService.updateProfile(data)

            // Update local user data
            const state = thunkAPI.getState()
            const updatedUser = { ...state.auth.user, ...response.user }
            await saveUserToStorage(updatedUser)

            safeShowMessage({
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

/* -------------------- SLICE -------------------- */
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // User data
        user: null,
        tempToken: null,

        // Auth status
        isLoggedIn: false,
        isLoading: false,
        isInitializing: true,
        isAppReady: false,

        // Device info
        deviceId: null,

        // App state
        hasCompletedOnboarding: null,

        // Error handling
        error: null,
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
            state.deviceId = null
        },

        setUser: (state, action) => {
            state.user = action.payload
            state.isLoggedIn = !!action.payload
        },

        clearError: (state) => {
            state.error = null
        },

        updateUserField: (state, action) => {
            const { field, value } = action.payload
            if (state.user) {
                state.user[field] = value
            }
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload
        },

        setAppReady: (state) => {
            state.isAppReady = true
            state.isInitializing = false
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------- INITIALIZE APPLICATION ---------- */
            .addCase(initializeApplication.pending, (state) => {
                state.isInitializing = true
                state.isAppReady = false
                state.error = null
            })
            .addCase(initializeApplication.fulfilled, (state, action) => {
                state.isInitializing = false
                state.isAppReady = true
                state.isLoading = false
                state.hasCompletedOnboarding =
                    action.payload.hasCompletedOnboarding
                state.isLoggedIn = action.payload.isLoggedIn
                state.user = action.payload.userData
                state.deviceId = action.payload.deviceId
                state.error = null
            })
            .addCase(initializeApplication.rejected, (state, action) => {
                state.isInitializing = false
                state.isAppReady = true
                state.isLoggedIn = false
                state.user = null
                state.isLoading = false
                state.error = action.payload?.message || 'Initialization failed'
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
            })

            /* ---------- SIGNIN ---------- */
            .addCase(signinSendOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.tempToken = action.payload.tempToken
                state.error = null
            })

            /* Inside extraReducers builder */
            .addCase(signinSendOTP.rejected, (state, action) => {
                state.isLoading = false // Force loading off
                state.error = action.payload
            })

            .addCase(signinVerifyOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                state.tempToken = null
                state.error = null
            })

            /* ---------- PASSWORD RESET ---------- */
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.error = null
            })

            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })

            /* ---------- LOGOUT ---------- */
            // .addCase(logout.fulfilled, (state) => {
            //     state.user = null
            //     state.isLoggedIn = false
            //     state.tempToken = null
            //     state.error = null
            // })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.isLoggedIn = false
                state.tempToken = null
                state.error = null
                state.isLoading = false // 👈 Add this to kill the "Sending OTP" spinner
            })
            // .addCase(signinVerifyStaffOTP.fulfilled, (state, action) => {
            //     state.isLoading = false
            //     state.isLoggedIn = true
            //     state.user = action.payload.user
            // })

            /* ---------- ONBOARDING ---------- */
            .addCase(markOnboardingComplete.fulfilled, (state) => {
                state.hasCompletedOnboarding = true
                state.isLoading = false
            })

            .addCase(resetOnboarding.fulfilled, (state) => {
                state.hasCompletedOnboarding = false
                state.isLoading = false
            })

            /* ---------- PENDING MATCHER ---------- */
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth/') &&
                    action.type.endsWith('/pending'),
                (state, action) => {
                    // Don't set loading for initialization
                    if (!action.type.includes('initializeApplication')) {
                        state.isLoading = true
                    }
                    state.error = null
                }
            )

            /* ---------- REJECTED MATCHER ---------- */
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    state.error = action.payload

                    // Don't show message for silent errors or initialization
                    if (
                        action.payload &&
                        !action.type.includes('refreshFCMToken') &&
                        !action.type.includes('initializeApplication')
                    ) {
                        safeShowMessage({
                            message: action.payload,
                            type: 'danger',
                            duration: 4000,
                        })
                    }
                }
            )
    },
})

/* -------------------- SELECTORS -------------------- */
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectIsLoading = (state) => state.auth.isLoading
export const selectIsInitializing = (state) => state.auth.isInitializing
export const selectIsAppReady = (state) => state.auth.isAppReady
export const selectHasOnboardingCompleted = (state) =>
    state.auth.hasCompletedOnboarding
export const selectError = (state) => state.auth.error
export const selectDeviceId = (state) => state.auth.deviceId

/* -------------------- EXPORTS -------------------- */
export const {
    setTempToken,
    resetAuthState,
    setUser,
    clearError,
    updateUserField,
    setLoading,
    setAppReady,
} = authSlice.actions

export default authSlice.reducer
