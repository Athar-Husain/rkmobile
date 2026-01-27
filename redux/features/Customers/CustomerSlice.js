// src/redux/features/Customers/CustomerSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import messaging from '@react-native-firebase/messaging'
import CustomerService from './CustomerService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PermissionsAndroid, Platform } from 'react-native'

const initialState = {
    allCustomers: [],
    newCustomer: null,
    customer: null,
    searchedCustomer: null,
    isLoading: true, // Set to true to indicate the app is initializing
    isSuccess: false,
    isError: false,
    message: '',
    token: null,
    isLoggedIn: false,
    hasCompletedOnboarding: null, // Null to indicate initial check hasn't run
}

// Helper to extract a readable error message
const getError = (err) =>
    err?.response?.data?.message || err.message || 'Something went wrong'

// Thunks
// This thunk will handle all initial app setup, checking for login and onboarding status.

// this is in customer slice
// redux/features/Customers/CustomerSlice.js
export const initializeApplication = createAsyncThunk(
    'customer/initializeApplication',
    async (_, thunkAPI) => {
        try {
            // Step 2: Get the FCM Token
            const fcmToken = await AsyncStorage.getItem('fcm_token')
            console.log('FCM Token obtained during initialization:', fcmToken)
            // Check onboarding status
            const onboardingCompleted = await AsyncStorage.getItem(
                'onboarding_completed'
            )
            const hasCompletedOnboarding = onboardingCompleted === 'true'

            // Check for a valid login token
            const isLoggedIn = await CustomerService.TokenManager.isValid()

            let customerData = null
            if (isLoggedIn) {
                // Fetch profile data if logged in
                customerData = await CustomerService.getProfile()
            } else {
                // Clear token from storage if it's invalid
                await CustomerService.TokenManager.clear()
            }
            return { hasCompletedOnboarding, isLoggedIn, customerData }
        } catch (error) {
            console.error('Failed to initialize app state', error)
            await CustomerService.TokenManager.clear()
            // Return initial state on failure
            return thunkAPI.rejectWithValue('App initialization failed.')
        }
    }
)

export const registerCustomer = createAsyncThunk(
    'customer/register',
    async (data, thunkAPI) => {
        try {
            return await CustomerService.register(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const loginCustomerold = createAsyncThunk(
    'customer/login',
    async (data, thunkAPI) => {
        try {
            const response = await CustomerService.login(data)
            await CustomerService.TokenManager.save(
                response.token,
                response.expiresIn
            )
            // Call getProfile to fetch full customer data after successful login
            const customerData = await CustomerService.getProfile()
            return { ...response, customer: customerData }
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const loginCustomerold2 = createAsyncThunk(
    'customer/login',
    async (data, thunkAPI) => {
        try {
            // 1. Get FCM token for this device
            const fcmToken = await messaging().getToken()

            // 2. Call backend login API with { email, password, fcmToken }

            const response = await CustomerService.login({
                ...data,
                fcmToken,
            })

            // 3. Save JWT token in storage
            await CustomerService.TokenManager.save(
                response.token,
                response.expiresIn
            )

            // 4. Fetch profile after successful login
            const customerData = await CustomerService.getProfile()

            return { ...response, customer: customerData }
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const loginCustomer = createAsyncThunk(
    'customer/login',
    async (data, thunkAPI) => {
        try {
            // 1. Get FCM token from AsyncStorage (already generated in permission flow)
            const fcmToken = await AsyncStorage.getItem('fcm_token')

            if (!fcmToken) {
                console.warn('⚠️ No FCM token found during login')
            }

            // 2. Call backend login API with { email, password, fcmToken }
            const response = await CustomerService.login({
                ...data,
                fcmToken,
            })

            // 3. Save JWT token in storage
            await CustomerService.TokenManager.save(
                response.token,
                response.expiresIn
            )

            // 4. Store user ID for later use
            // await AsyncStorage.setItem('user_id', response.customer._id)

            // 5. Fetch profile after successful login
            const customerData = await CustomerService.getProfile()

            return { ...response, customer: customerData }
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getAllCustomers = createAsyncThunk(
    'customer/getAll',
    async (_, thunkAPI) => {
        try {
            return await CustomerService.getAll()
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getCustomerProfile = createAsyncThunk(
    'customer/getProfile',
    async (_, thunkAPI) => {
        try {
            return await CustomerService.getProfile()
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const updateCustomer = createAsyncThunk(
    'customer/update',
    async (data, thunkAPI) => {
        try {
            return await CustomerService.update(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const forgotPassword = createAsyncThunk(
    'customer/forgotPassword',
    async (email, thunkAPI) => {
        try {
            return await CustomerService.forgotPassword(email)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const verifyOtp = createAsyncThunk(
    'customer/verifyOtp',
    async (data, thunkAPI) => {
        try {
            return await CustomerService.verifyOtp(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const changePassword = createAsyncThunk(
    'customer/changePassword',
    async (data, thunkAPI) => {
        try {
            return await CustomerService.changePassword(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const logoutCustomerold = createAsyncThunk(
    'customer/logout',
    async (_, thunkAPI) => {
        try {
            await CustomerService.logout()
            await CustomerService.TokenManager.clear()
            // Clear the onboarding status as well to show it on next app start
            // await AsyncStorage.removeItem('onboarding_completed')
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// UPDATED LOGOUT THUNK
// ==========================================
export const logoutCustomer = createAsyncThunk(
    'customer/logout',
    async (_, thunkAPI) => {
        try {
            // 1. Get FCM token and user ID
            const fcmToken = await AsyncStorage.getItem('fcm_token')
            const userId = await AsyncStorage.getItem('user_id')

            // 2. Call backend logout to remove FCM token from user's record
            if (fcmToken && userId) {
                await CustomerService.logout({ userId, fcmToken })
            }

            // 3. Clear JWT token
            await CustomerService.TokenManager.clear()

            // 4. Delete FCM token from device and storage
            await messaging().deleteToken()
            await AsyncStorage.removeItem('fcm_token')
            await AsyncStorage.removeItem('user_id')

            console.log('🚪 User logged out successfully')
        } catch (error) {
            console.error('❌ Logout error:', error)
            // Still clear local data even if backend call fails
            await CustomerService.TokenManager.clear()
            await AsyncStorage.removeItem('fcm_token')
            await AsyncStorage.removeItem('user_id')

            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const searchCustomerByPhone = createAsyncThunk(
    'customer/searchByPhone',
    async (phone, thunkAPI) => {
        try {
            return await CustomerService.searchByPhone(phone)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// New thunk to handle onboarding completion
export const markOnboardingComplete = createAsyncThunk(
    'customer/markOnboardingComplete',
    async (_, thunkAPI) => {
        try {
            await AsyncStorage.setItem('onboarding_completed', 'true')
            return true
        } catch (error) {
            return thunkAPI.rejectWithValue(
                'Failed to mark onboarding as complete'
            )
        }
    }
)
export const resetOnboarding = createAsyncThunk(
    'customer/resetOnboarding',
    async (_, thunkAPI) => {
        try {
            await AsyncStorage.setItem('onboarding_completed', 'false')
            return true
        } catch (error) {
            return thunkAPI.rejectWithValue(
                'Failed to mark onboarding as complete'
            )
        }
    }
)

export const switchConnection = createAsyncThunk(
    'customer/switchConnection',
    async (data, thunkAPI) => {
        try {
            return await CustomerService.switchConnection(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        resetCustomerState: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
            state.customer = null
            state.searchedCustomer = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle App Initialization
            .addCase(initializeApplication.pending, (state) => {
                state.isLoading = true
            })
            .addCase(initializeApplication.fulfilled, (state, action) => {
                state.isLoading = false
                state.isLoggedIn = action.payload.isLoggedIn
                state.hasCompletedOnboarding =
                    action.payload.hasCompletedOnboarding
                state.customer = action.payload.customerData || null
            })
            .addCase(initializeApplication.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // Handle Login
            .addCase(loginCustomer.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.token = action.payload.token
                state.customer = action.payload.customer
                state.isLoggedIn = true
                showMessage({ message: 'Login successful!', type: 'success' })
            })
            // Handle Logout
            .addCase(logoutCustomer.fulfilled, (state) => {
                state.isLoading = false
                state.token = null
                state.customer = null
                state.isLoggedIn = false
                state.hasCompletedOnboarding = false // Reset for new user
                showMessage({
                    message: 'Logged out successfully!',
                    type: 'success',
                })
            })

            .addCase(updateCustomer.fulfilled, (state) => {
                state.isLoading = false
                showMessage({
                    message: 'Customer updated successfully!',
                    type: 'success',
                })
            })
            // .addCase(switchConnection.fulfilled, (state) => {
            //     state.isLoading = false
            //     showMessage({
            //         message: 'Connection Switched successfully!',
            //         type: 'success',
            //     })
            // })
            .addCase(switchConnection.fulfilled, (state, action) => {
                state.isLoading = false
                // Update the customer's activeConnection with the ID from the payload
                state.customer = {
                    ...state.customer,
                    activeConnection: action.payload.activeConnection,
                }
                showMessage({
                    message: 'Connection switched successfully!',
                    type: 'success',
                })
            })

            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false
                showMessage({ message: 'OTP sent to email!', type: 'success' })
            })
            // Verify OTP
            .addCase(verifyOtp.fulfilled, (state) => {
                state.isLoading = false
                showMessage({ message: 'OTP verified!', type: 'success' })
            })
            // Change Password
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false
                showMessage({
                    message: 'Password changed successfully!',
                    type: 'success',
                })
            })
            // Handle Onboarding Completion
            .addCase(markOnboardingComplete.fulfilled, (state) => {
                state.hasCompletedOnboarding = true
                state.isLoading = false
            })
            .addCase(resetOnboarding.fulfilled, (state) => {
                state.hasCompletedOnboarding = false
                state.isLoading = false
            })
            // Handle all other thunks
            .addMatcher(
                (action) =>
                    action.type.startsWith('customer/') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true
                    state.isError = false
                    state.isSuccess = false
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith('customer/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    state.isError = true
                    state.message = action.payload || 'Failed to perform action'
                    showMessage({ message: state.message, type: 'danger' })
                    // console.error('error in customer Slice', state.message)
                }
            )
    },
})

export const { resetCustomerState } = customerSlice.actions
export default customerSlice.reducer
