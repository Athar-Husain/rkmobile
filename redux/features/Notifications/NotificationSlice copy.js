import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import notificationService from './NotificationService'

const initialState = {
    notifications: [],
    unreadCount: 0,
    pagination: {
        page: 1,
        pages: 1,
        total: 0,
    },
    isNotificationLoading: false,
    isNotificationError: false,
    isNotificationSuccess: false,
    notificationMessage: '',
}

const getError = (err) =>
    err?.response?.data?.message || err.message || 'Something went wrong'

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

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        resetNotificationState: (state) => {
            state.notifications = []
            state.unreadCount = 0
            state.pagination = { page: 1, pages: 1, total: 0 }
            state.isNotificationLoading = false
            state.isNotificationError = false
            state.isNotificationSuccess = false
            state.notificationMessage = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isNotificationLoading = false
                // Logic: If page 1, replace. If page > 1, append.
                const { notifications, unreadCount, pagination } =
                    action.payload
                if (pagination.page === 1) {
                    state.notifications = notifications
                } else {
                    state.notifications = [
                        ...state.notifications,
                        ...notifications,
                    ]
                }
                state.unreadCount = unreadCount
                state.pagination = pagination
            })
            .addCase(markNotificationsRead.fulfilled, (state, action) => {
                const ids = action.meta.arg
                state.notifications = state.notifications.map((n) =>
                    ids.includes(n._id) ? { ...n, isRead: true } : n
                )
                state.unreadCount = Math.max(0, state.unreadCount - ids.length)
            })
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map((n) => ({
                    ...n,
                    isRead: true,
                }))
                state.unreadCount = 0
            })
            .addMatcher(
                (action) =>
                    action.type.startsWith('notifications/') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isNotificationLoading = true
                }
            )
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
                    showMessage({ message: msg, type: 'danger' })
                }
            )
    },
})

export const { resetNotificationState } = notificationSlice.actions
export default notificationSlice.reducer
