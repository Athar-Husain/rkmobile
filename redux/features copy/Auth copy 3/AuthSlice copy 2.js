import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import AuthService from './AuthService'
import AsyncStorage from '@react-native-async-storage/async-storage'

/* -------------------- CONSTANTS -------------------- */
const AUTH_STORAGE_KEYS = {
    USER: 'user_data',
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    isAppReady: false,
    ONBOARDING: 'onboarding_completed',
    FCM_TOKEN: 'fcm_token',
}

/* -------------------- HELPERS -------------------- */
const errorMessage = (e) => {
    const message =
        e?.response?.data?.message ||
        e?.message ||
        'Something went wrong. Please try again.'

    // Log error for debugging
    if (process.env.NODE_ENV !== 'production') {
        console.error('Auth Error:', e)
    }

    return message
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
            AUTH_STORAGE_KEYS.TOKEN,
            AUTH_STORAGE_KEYS.REFRESH_TOKEN,
            AUTH_STORAGE_KEYS.FCM_TOKEN,
        ])
    } catch (error) {
        console.error('Error clearing auth storage:', error)
    }
}

/* -------------------- ASYNC THUNKS -------------------- */

/**
 * Initialize application state
 * Checks auth status, onboarding, and loads user data
 */
// export const initializeApplicationOld = createAsyncThunk(
//     'auth/initializeApplication',
//     async (_, thunkAPI) => {
//         try {
//             // Get device ID first
//             const deviceId = await AuthService.getDeviceId()

//             // Check onboarding status
//             const onboardingCompleted = await AsyncStorage.getItem(
//                 'onboarding_completed'
//             )
//             const hasCompletedOnboarding = onboardingCompleted === 'true'

//             // Check if user is authenticated
//             const isAuthenticated = await AuthService.isAuthenticated()

//             let userData = null
//             let fcmToken = null

//             if (isAuthenticated) {
//                 try {
//                     // Try to get fresh user data from API
//                     const statusResponse = await AuthService.getLoginStatus()
//                     userData = statusResponse.user

//                     // Get stored user data as fallback
//                     if (!userData) {
//                         userData = await AuthService.getStoredUserData()
//                     }

//                     // Register/update FCM token
//                     fcmToken = await AuthService.registerFCMToken()

//                     // Save user data to storage
//                     if (userData) {
//                         await saveUserToStorage(userData)
//                     }
//                 } catch (apiError) {
//                     console.error('API initialization error:', apiError)

//                     // Use stored data if API fails
//                     userData = await AuthService.getStoredUserData()

//                     // If token seems invalid but stored, clear it
//                     if (!userData) {
//                         await clearAuthStorage()
//                     }
//                 }
//             } else {
//                 // Clear any stale data
//                 await clearAuthStorage()
//             }

//             return {
//                 hasCompletedOnboarding,
//                 isLoggedIn: isAuthenticated && !!userData,
//                 userData,
//                 fcmToken,
//                 deviceId,
//             }
//         } catch (error) {
//             console.error('Failed to initialize app state:', error)

//             // Clear invalid data
//             await clearAuthStorage()

//             return thunkAPI.rejectWithValue({
//                 message: 'Failed to initialize application',
//                 error: errorMessage(error),
//             })
//         }
//     }
// )

// authSlice.js

export const initializeApplication2 = createAsyncThunk(
    'auth/initializeApplication',
    async (_, thunkAPI) => {
        try {
            const [onboarding, token, storedUser] = await Promise.all([
                AsyncStorage.getItem(AUTH_STORAGE_KEYS.ONBOARDING),
                TokenManager.getToken(),
                AsyncStorage.getItem(AUTH_STORAGE_KEYS.USER),
            ])

            const hasCompletedOnboarding = onboarding === 'true'
            const isAuthenticated = !!token
            let userData = storedUser ? JSON.parse(storedUser) : null

            if (isAuthenticated) {
                try {
                    // Refresh user data in background
                    const response = await AuthService.getLoginStatus()
                    userData = response.user
                    await saveUserToStorage(userData)
                } catch (e) {
                    // If API fails, we still have userData from storage
                    console.log('Initialization: Using cached user data')
                }
            }

            return {
                hasCompletedOnboarding,
                isLoggedIn: isAuthenticated,
                userData,
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(errorMessage(error))
        }
    }
)

export const initializeApplication = createAsyncThunk(
    'auth/initializeApplication',
    async (_, thunkAPI) => {
        try {
            // 1. Get local data first (Fast)
            const [onboarding, token, userStr] = await Promise.all([
                AsyncStorage.getItem('onboarding_completed'),
                TokenManager.getToken(),
                AsyncStorage.getItem('user_data'),
            ])

            const hasCompletedOnboarding = onboarding === 'true'
            const isLoggedIn = !!token
            const userData = userStr ? JSON.parse(userStr) : null

            // 2. Return local state immediately to avoid UI jumping
            // You can fire a background profile update here if needed
            return {
                hasCompletedOnboarding,
                isLoggedIn,
                userData,
                deviceId: await AsyncStorage.getItem('deviceId'),
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Init Failed')
        }
    }
)

/**
 * Signup - Send OTP
 */
export const signupSendOTP = createAsyncThunk(
    'auth/signupSendOTP',
    async (data, thunkAPI) => {
        try {
            const response = await AuthService.signupSendOTP(data)

            // Store temp token in state
            thunkAPI.dispatch(setTempToken(response.tempToken))

            return response
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

        // Device info
        fcmToken: null,
        deviceId: null,

        // App state
        hasCompletedOnboarding: null,

        // Error handling
        error: null,
        lastError: null,

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
            /* ---------- INITIALIZE APPLICATION ---------- */
            .addCase(initializeApplication.pending, (state) => {
                state.isInitializing = true
                state.isLoading = true
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
            .addCase(initializeApplication.rejected, (state, action) => {
                state.isInitializing = false
                state.isLoading = false
                state.isLoggedIn = false
                state.user = null
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

            /* ---------- PENDING MATCHER ---------- */
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth/') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true
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
                    state.lastError = {
                        message: action.payload,
                        timestamp: Date.now(),
                        type: action.type,
                    }

                    // Don't show message for FCM errors (they're silent)
                    if (!action.type.includes('refreshFCMToken')) {
                        showMessage({
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
export const selectHasOnboardingCompleted = (state) =>
    state.auth.hasCompletedOnboarding
export const selectError = (state) => state.auth.error
export const selectFCMToken = (state) => state.auth.fcmToken
export const selectDeviceId = (state) => state.auth.deviceId

/* -------------------- EXPORTS -------------------- */
export const {
    setTempToken,
    resetAuthState,
    setFCMToken,
    setUser,
    clearError,
    updateUserField,
    setLoading,
} = authSlice.actions

export default authSlice.reducer
