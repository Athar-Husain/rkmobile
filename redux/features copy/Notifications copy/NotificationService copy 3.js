import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_API_URL } from '../../../utils/baseurl'
// REMOVED: import { setNotifications } from './NotificationSlice' // Cycle broken!

// Removed: NOTIFICATION_URL, TokenManager, axiosInstance, and the Interceptor.
// You can move them back here if other services rely on them, but for this cleanup, they are in the Slice.

// ==========================================
// Register FCM Token (Thunk) - Still here
// ==========================================
export const registerFCMToken = createAsyncThunk(
    'notifications/registerToken',
    async ({ userId, fcmToken, userType }, { rejectWithValue }) => {
        try {
            // NOTE: This route uses BASE_API_URL directly, not the NOTIFICATION_URL instance
            const response = await axios.post(
                `${BASE_API_URL}/register-fcm-token`,
                { userId, fcmToken, userType }
            )
            console.log('✅ FCM Token registered successfully')
            return response.data
        } catch (error) {
            console.error(
                '❌ Failed to register FCM token:',
                error?.response?.data || error.message
            )
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

// REMOVED: export const syncNotificationsFromBackend = createAsyncThunk(...)
// REMOVED: export const markNotificationAsRead = createAsyncThunk(...)
// REMOVED: export const deleteNotification = createAsyncThunk(...)

// ==========================================
// Send Test Notification (Optional - for testing) - Still here
// ==========================================
export const sendTestNotification = createAsyncThunk(
    'notifications/sendTest',
    async ({ customerId, title, message, type }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${BASE_API_URL}/send-notification`,
                {
                    customerId,
                    title,
                    message,
                    type,
                }
            )
            console.log('✅ Test notification sent')
            return response.data
        } catch (error) {
            console.error(
                '❌ Failed to send test notification:',
                error?.response?.data || error.message
            )
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)
