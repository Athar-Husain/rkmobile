import { createSlice, createAsyncThunk } from '@reduxjs/toolkit' // ADDED createAsyncThunk
import axios from 'axios' // ADDED axios
import AsyncStorage from '@react-native-async-storage/async-storage' // ADDED AsyncStorage
import { BASE_API_URL } from '../../../utils/baseurl' // ASSUMED import

// ==========================================
// THUNK SETUP (Moved from NotificationService.js)
// ==========================================
const NOTIFICATION_URL = `${BASE_API_URL}/api/notifications`

// Token Manager (Duplicated/Centralized for Thunks)
const TokenManager = {
    getToken: async () => await AsyncStorage.getItem('access_token'),
    isValid: async () => {
        const expiry = await AsyncStorage.getItem('token_expiry')
        return expiry && Date.now() < parseInt(expiry, 10)
    },
}

// Create axios instance
const axiosInstance = axios.create({
    baseURL: NOTIFICATION_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Attach token to requests
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await TokenManager.getToken()
        const isValid = await TokenManager.isValid()
        if (token && isValid) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// NOTE: registerFCMToken and sendTestNotification still rely on external BASE_API_URL,
// so they can remain in a refactored NotificationService (or be moved here too for simplicity).
// For now, let's move the ones causing the cycle:

// Sync Notifications from Backend (Thunk)
export const syncNotificationsFromBackend = createAsyncThunk(
    'notifications/syncFromBackend',
    async (customerId, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/customer/${customerId}`)
            // The slice's action is available inside the thunk function body:
            dispatch(
                notificationSlice.actions.setNotifications(
                    response.data.notifications || []
                )
            )

            console.log('✅ Notifications synced from backend')
            return response.data.notifications
        } catch (error) {
            console.error(
                '❌ Failed to sync notifications:',
                error?.response?.data || error.message
            )
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

// Mark Notification as Read (Thunk)
export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `/${notificationId}/read`
            )
            console.log('✅ Notification marked as read')
            return response.data // Should contain the updated notification
        } catch (error) {
            console.error(
                '❌ Failed to mark notification as read:',
                error?.response?.data || error.message
            )
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

// Delete Notification (Thunk)
export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (notificationId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/${notificationId}`)
            console.log('✅ Notification deleted')
            return notificationId // Return ID for slice update
        } catch (error) {
            console.error(
                '❌ Failed to delete notification:',
                error?.response?.data || error.message
            )
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

// ==========================================
// Slice Definition
// ==========================================
const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isError: false,
    message: '',
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            // ... (rest of addNotification logic)
        },
        setNotifications: (state, action) => {
            // REDUCER MUST REMAIN HERE
            state.notifications = action.payload
            state.unreadCount = action.payload.filter((n) => !n.read).length
        },
        markAllAsRead: (state) => {
            // ... (rest of markAllAsRead logic)
        },
        clearNotifications: (state) => {
            // ... (rest of clearNotifications logic)
        },
    },
    extraReducers: (builder) => {
        builder
            // Sync from backend
            .addCase(syncNotificationsFromBackend.pending, (state) => {
                state.isLoading = true
            })
            .addCase(syncNotificationsFromBackend.fulfilled, (state) => {
                state.isLoading = false
                // No need to update state here, setNotifications was dispatched in the thunk
            })
            .addCase(syncNotificationsFromBackend.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            // Mark as read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(
                    (n) => n._id === action.payload._id
                )
                if (notification && !notification.read) {
                    notification.read = true
                    state.unreadCount = Math.max(0, state.unreadCount - 1)
                }
            })

            // Delete notification
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(
                    (n) => n._id === action.payload
                )
                if (index !== -1) {
                    const wasUnread = !state.notifications[index].read
                    state.notifications.splice(index, 1)
                    if (wasUnread) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1)
                    }
                }
            })
    },
})

export const {
    addNotification,
    setNotifications,
    markAllAsRead,
    clearNotifications,
} = notificationSlice.actions

export default notificationSlice.reducer
