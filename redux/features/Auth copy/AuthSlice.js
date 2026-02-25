// redux/features/Auth/AuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import AuthService, { FCMService } from './AuthService'
import StaffService from '../Staff/StaffService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { TokenManager } from '../../../utils/tokenManager'

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
        await TokenManager.clear()
    } catch (error) {
        console.error('Error clearing auth storage:', error)
    }
}

// Safe showMessage wrapper
export const safeShowMessage = (config) => {
    try {
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

// -------------------- APP INITIALIZATION --------------------
export const initializeApplication = createAsyncThunk(
    'auth/initializeApplication',
    async (_, thunkAPI) => {
        try {
            const deviceId =
                (await AsyncStorage.getItem('deviceId')) ||
                `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            if (!(await AsyncStorage.getItem('deviceId'))) {
                await AsyncStorage.setItem('deviceId', deviceId)
            }

            const onboardingCompleted = await AsyncStorage.getItem(
                AUTH_STORAGE_KEYS.ONBOARDING
            )
            const hasCompletedOnboarding = onboardingCompleted === 'true'

            let userData = null
            let userType = null
            const token = await TokenManager.getToken()

            if (token) {
                // Check if customer
                if (await AuthService.isAuthenticated()) {
                    const statusResponse = await AuthService.getLoginStatus()
                    userData = statusResponse.user
                    userType = 'customer'
                }
                // Check if staff
                else if (await StaffService.getStaffLoginStatus()) {
                    const statusResponse =
                        await StaffService.getStaffLoginStatus()
                    userData = statusResponse.user
                    userType = 'staff'
                } else {
                    await clearAuthStorage()
                }
            }

            return {
                deviceId,
                userData,
                userType,
                isLoggedIn: !!userData,
                hasCompletedOnboarding,
            }
        } catch (error) {
            console.error('Failed to initialize app state:', error)
            await clearAuthStorage()
            return thunkAPI.rejectWithValue({
                message:
                    'Failed to initialize application. Please restart the app.',
                code: 'INIT_FAILED',
            })
        }
    }
)

// -------------------- CUSTOMER THUNKS --------------------
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
            if (response.user) await saveUserToStorage(response.user)
            safeShowMessage({
                message: 'Account created successfully!',
                type: 'success',
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
            if (response.user) await saveUserToStorage(response.user)
            safeShowMessage({ message: 'Login successful!', type: 'success' })
            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

// -------------------- STAFF THUNKS --------------------
export const signinStaffSendOTP = createAsyncThunk(
    'auth/signinStaffSendOTP',
    async (data, thunkAPI) => {
        try {
            const response = await StaffService.signinSendOTP(data)
            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const signinStaffVerifyOTP = createAsyncThunk(
    'auth/signinStaffVerifyOTP',
    async (data, thunkAPI) => {
        try {
            const response = await StaffService.signinVerifyOTP(data)
            if (response.user) await saveUserToStorage(response.user)
            safeShowMessage({
                message: 'Staff login successful!',
                type: 'success',
            })
            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

// -------------------- PASSWORD RESET --------------------
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

export const staffForgotPassword = createAsyncThunk(
    'auth/staffForgotPassword',
    async (data, thunkAPI) => {
        try {
            return await StaffService.staffForgotPassword(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const staffResetPassword = createAsyncThunk(
    'auth/staffResetPassword',
    async (data, thunkAPI) => {
        try {
            return await StaffService.staffResetPassword(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

// -------------------- LOGOUT --------------------
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState()
        if (state.auth.user.userType === 'staff') {
            await StaffService.staffLogout()
        } else {
            await AuthService.logout()
        }
        safeShowMessage({ message: 'Logged out successfully', type: 'info' })
        return true
    } catch (e) {
        await clearAuthStorage()
        return thunkAPI.rejectWithValue(errorMessage(e))
    }
})

// -------------------- PROFILE --------------------
export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState()
            const user =
                state.auth.userType === 'staff'
                    ? await StaffService.getStaffProfile()
                    : await AuthService.getProfile()
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
            const state = thunkAPI.getState()
            const response =
                state.auth.userType === 'staff'
                    ? await StaffService.updateStaffProfile(data)
                    : await AuthService.updateProfile(data)
            const updatedUser = { ...state.auth.user, ...response.user }
            await saveUserToStorage(updatedUser)
            safeShowMessage({
                message: 'Profile updated successfully',
                type: 'success',
            })
            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

// -------------------- REFRESH FCM TOKEN --------------------
export const refreshFCMToken = createAsyncThunk(
    'auth/refreshFCMToken',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState()
            const token =
                state.auth.userType === 'staff'
                    ? await StaffService.registerStaffFCMToken()
                    : await AuthService.updateFCMToken()
            return token
        } catch (e) {
            console.log('FCM Token Refresh Error:', e.message)
            return thunkAPI.rejectWithValue(null)
        }
    }
)

// -------------------- ONBOARDING --------------------
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

// -------------------- SLICE --------------------
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        userType: null, // 'customer' | 'staff'
        tempToken: null,
        isLoggedIn: false,
        isLoading: false,
        isInitializing: true,
        isAppReady: false,
        deviceId: null,
        hasCompletedOnboarding: null,
        error: null,
    },
    reducers: {
        setTempToken: (state, action) => {
            state.tempToken = action.payload
        },
        resetAuthState: (state) => {
            state.user = null
            state.userType = null
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
            if (state.user) state.user[field] = value
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
            // -------------------- INITIALIZE APPLICATION --------------------
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
                state.userType = action.payload.userType
                state.deviceId = action.payload.deviceId
                state.error = null
            })
            .addCase(initializeApplication.rejected, (state, action) => {
                state.isInitializing = false
                state.isAppReady = true
                state.isLoggedIn = false
                state.user = null
                state.userType = null
                state.isLoading = false
                state.error = action.payload?.message || 'Initialization failed'
            })

            // -------------------- OTP & LOGIN --------------------
            .addCase(signupSendOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.tempToken = action.payload.tempToken
                state.error = null
            })
            .addCase(signupVerifyOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                state.userType = 'customer'
                state.tempToken = null
                state.error = null
            })
            .addCase(signinSendOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.tempToken = action.payload.tempToken
                state.error = null
            })
            .addCase(signinVerifyOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                state.userType = 'customer'
                state.tempToken = null
                state.error = null
                AsyncStorage.setItem('userType', 'customer')
            })
            .addCase(signinStaffSendOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.tempToken = action.payload.tempToken
                state.error = null
            })
            .addCase(signinStaffVerifyOTP.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                state.userType = 'staff'
                state.tempToken = null
                state.error = null
                AsyncStorage.setItem('userType', 'staff')
            })

            // -------------------- PASSWORD RESET --------------------
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })
            .addCase(staffForgotPassword.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })
            .addCase(staffResetPassword.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })

            // -------------------- LOGOUT --------------------
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.userType = null
                state.isLoggedIn = false
                state.tempToken = null
                state.error = null
                state.isLoading = false
                AsyncStorage.removeItem('userType')
            })

            // -------------------- ONBOARDING --------------------
            .addCase(markOnboardingComplete.fulfilled, (state) => {
                state.hasCompletedOnboarding = true
                state.isLoading = false
            })
            .addCase(resetOnboarding.fulfilled, (state) => {
                state.hasCompletedOnboarding = false
                state.isLoading = false
            })

            // -------------------- PENDING MATCHER --------------------
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth/') &&
                    action.type.endsWith('/pending'),
                (state, action) => {
                    if (!action.type.includes('initializeApplication'))
                        state.isLoading = true
                    state.error = null
                }
            )

            // -------------------- REJECTED MATCHER --------------------
            .addMatcher(
                (action) =>
                    action.type.startsWith('auth/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    state.error = action.payload
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
export const selectUserType = (state) => state.auth.userType
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
