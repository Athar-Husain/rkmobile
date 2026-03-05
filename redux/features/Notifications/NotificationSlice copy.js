import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import notificationService from './NotificationService'

// ========================
// Initial State
// ========================
const initialState = {
    notifications: [],
    unreadCount: 0,
    pagination: null,
    isNotificationLoading: false,
    isNotificationError: false,
    isNotificationSuccess: false,
    notificationMessage: '',
}

const getError = (err) =>
    err?.response?.data?.message || err.message || 'Something went wrong'

// ========================
// GET NOTIFICATIONS
// ========================
export const getNotifications = createAsyncThunk(
    'notifications/getNotifications',
    async (params, thunkAPI) => {
        try {
            return await notificationService.getMyNotifications(params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// ========================
// MARK SELECTED AS READ
// ========================
export const markNotificationsRead = createAsyncThunk(
    'notifications/markRead',
    async (ids, thunkAPI) => {
        try {
            return await notificationService.markNotificationsAsRead(ids)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// ========================
// MARK ALL AS READ
// ========================
export const markAllNotificationsRead = createAsyncThunk(
    'notifications/markAllRead',
    async (_, thunkAPI) => {
        try {
            return await notificationService.markAllNotificationsAsRead()
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// ========================
// SLICE
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
            // GET NOTIFICATIONS
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isNotificationLoading = false
                state.notifications = action.payload.notifications
                console.log('getNotifications action paye', action.payload)
                state.unreadCount = action.payload.unreadCount
                state.pagination = action.payload.pagination
            })

            // MARK SELECTED READ
            .addCase(markNotificationsRead.fulfilled, (state, action) => {
                const ids = action.meta.arg

                state.notifications = state.notifications.map((n) =>
                    ids.includes(n._id) ? { ...n, isRead: true } : n
                )
            })

            // MARK ALL READ
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map((n) => ({
                    ...n,
                    isRead: true,
                }))
                state.unreadCount = 0
            })

            // LOADING
            .addMatcher(
                (action) =>
                    action.type.startsWith('notifications/') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isNotificationLoading = true
                }
            )

            // ERROR
            .addMatcher(
                (action) =>
                    action.type.startsWith('notifications/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isNotificationLoading = false
                    state.isNotificationError = true

                    const msg =
                        typeof action.payload === 'string'
                            ? action.payload
                            : 'Something went wrong'

                    state.notificationMessage = msg

                    showMessage({
                        message: msg,
                        type: 'danger',
                    })
                }
            )
    },
})

export const { resetNotificationState } = notificationSlice.actions
export default notificationSlice.reducer
