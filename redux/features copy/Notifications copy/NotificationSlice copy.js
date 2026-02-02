// src/redux/features/notifications/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    list: [], // all notifications
    
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.list.unshift({
                id: Date.now().toString(),
                ...action.payload,
                read: false,
            })
        },
        markAsRead: (state, action) => {
            const index = state.list.findIndex((n) => n.id === action.payload)
            if (index !== -1) state.list[index].read = true
        },
        clearNotifications: (state) => {
            state.list = []
        },
    },
})

export const { addNotification, markAsRead, clearNotifications } =
    notificationSlice.actions
export default notificationSlice.reducer
