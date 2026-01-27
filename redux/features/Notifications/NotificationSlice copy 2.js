import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notifications: [],
    unreadCount: 0,
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            // Add new notification at the front (newest first)
            state.notifications.unshift(action.payload)
            state.unreadCount += 1
        },
        markAllAsRead: (state) => {
            state.unreadCount = 0
            // Optionally update each notification if you track read status
            state.notifications = state.notifications.map((notif) => ({
                ...notif,
                read: true,
            }))
        },
        clearNotifications: (state) => {
            state.notifications = []
            state.unreadCount = 0
        },
    },
})

export const { addNotification, markAllAsRead, clearNotifications } =
    notificationSlice.actions

export default notificationSlice.reducer
