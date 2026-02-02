// src/features/notifications/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import notificationService from '../../api/notificationService.js'
import { showMessage } from 'react-native-flash-message'
import notificationService from './NotificationService'

// ========================
// 🔹 Initial State
// ========================
const initialState = {
    notifications: [],
    isNotificationLoading: false,
    isNotificationError: false,
    isNotificationSuccess: false,
    notificationMessage: '',
}

// ========================
// 🔹 Thunks
// ========================

const getError = (err) =>
    err?.response?.data?.message || err.message || 'Something went wrong'

// Get notifications
export const getNotifications = createAsyncThunk(
    'notifications/getNotifications',
    async (_, thunkAPI) => {
        try {
            return await notificationService.getNotificationsForUser()
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// Send notification to one user
export const sendNotification = createAsyncThunk(
    'notifications/send',
    async (data, thunkAPI) => {
        try {
            return await notificationService.sendNotificationToCustomer(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// Send notification to all users
export const sendNotificationToAll = createAsyncThunk(
    'notifications/sendToAll',
    async (data, thunkAPI) => {
        try {
            return await notificationService.sendNotificationToAllCustomers(
                data
            )
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// Mark as read
export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, thunkAPI) => {
        try {
            return await notificationService.markNotificationAsRead(
                notificationId
            )
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// Delete notification
export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (notificationId, thunkAPI) => {
        try {
            await notificationService.deleteNotification(notificationId)
            return notificationId // return ID for removing it from state
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// Register FCM token
export const registerFCMToken = createAsyncThunk(
    'notifications/registerToken',
    async (data, thunkAPI) => {
        try {
            return await notificationService.registerCustomerFCMToken(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// Unregister FCM token
export const unregisterFCMToken = createAsyncThunk(
    'notifications/unregisterToken',
    async (data, thunkAPI) => {
        try {
            return await notificationService.unregisterCustomerFCMToken(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// ========================
// 🔹 Slice
// ========================
const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        resetNotificationState: (state) => {
            state.isNotificationLoading = false
            state.isNotificationError = false
            state.isNotificationSuccess = false
            state.notificationMessage = ''
        },
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Get Notifications
            // .addCase(getNotifications.pending, (state) => {
            //     state.isNotificationLoading = true
            // })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isNotificationLoading = false
                state.isNotificationSuccess = true

                state.notifications = action.payload
                showMessage({
                    message: 'Notification Found successfully!',
                    type: 'success',
                })
            })
            // .addCase(getNotifications.rejected, (state, action) => {
            //     state.isNotificationLoading = false
            //     state.isNotificationError = true
            //     state.notificationMessage = action.payload
            //     showMessage({ message: action.payload, type: 'danger' })
            // })

            // 🔹 Send Notification
            .addCase(sendNotification.fulfilled, (state, action) => {
                state.isNotificationSuccess = true
                state.notifications.unshift(action.payload.notification)
                showMessage({
                    message: 'Notification sent successfully!',
                    type: 'success',
                })
            })

            // 🔹 Send to All
            .addCase(sendNotificationToAll.fulfilled, (state) => {
                state.isNotificationSuccess = true
                showMessage({
                    message: 'Notification sent to all users!',
                    type: 'success',
                })
            })

            // 🔹 Mark as Read
            .addCase(markAsRead.fulfilled, (state, action) => {
                const idx = state.notifications.findIndex(
                    (n) => n._id === action.payload._id
                )
                if (idx !== -1) state.notifications[idx] = action.payload
            })

            // 🔹 Delete Notification
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(
                    (n) => n._id !== action.payload
                )
                showMessage({
                    message: 'Notification deleted',
                    type: 'success',
                })
            })

            // 🔹 FCM token registration/unregistration
            .addCase(registerFCMToken.fulfilled, (state) => {
                state.isNotificationSuccess = true
            })
            .addCase(unregisterFCMToken.fulfilled, (state) => {
                state.isNotificationSuccess = true
            })

            // 🔹 Matchers for Loading & Errors
            .addMatcher(
                (action) =>
                    action.type.startsWith('notifications/') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isNotificationLoading = true
                    state.isNotificationError = false
                    state.isNotificationSuccess = false
                    state.notificationMessage = ''
                }
            )
            // .addMatcher(
            //     (action) =>
            //         action.type.startsWith('notifications/') &&
            //         action.type.endsWith('/rejected'),
            //     (state, action) => {
            //         state.isNotificationLoading = false
            //         state.isNotificationError = true
            //         state.isNotificationSuccess = false
            //         state.notificationMessage = action.payload
            //         showMessage({ message: action.payload, type: 'danger' })
            //     }
            // )
            // src/features/notifications/notificationSlice.js

            .addMatcher(
                (action) =>
                    action.type.startsWith('notifications/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    // ... (other state updates)

                    // ✅ This correctly normalizes action.payload into a string message (msg)
                    const msg =
                        typeof action.payload === 'string'
                            ? action.payload
                            : action.payload?.message &&
                                typeof action.payload.message === 'string'
                              ? action.payload.message
                              : JSON.stringify(
                                    action.payload?.message ||
                                        'Something went wrong'
                                )

                    state.notificationMessage = msg

                    showMessage({
                        message: msg, // ✅ Now passing a guaranteed STRING
                        type: 'danger',
                    })
                }
            )
    },
})

export const { resetNotificationState } = notificationSlice.actions
export default notificationSlice.reducer
