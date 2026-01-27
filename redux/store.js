// scr/reduc/features/store.js
import { configureStore } from '@reduxjs/toolkit'
import customerReducer from './features/Customers/CustomerSlice'
import connectionReducer from './features/Connection/ConnectionSlice'
import planReducer from './features/Plan/PlanSlice'
import ticketReducer from './features/Tickets/TicketSlice'
import notificationReducer from './features/Notifications/NotificationSlice'

export const store = configureStore({
    reducer: {
        customer: customerReducer,
        connection: connectionReducer,
        plan: planReducer,
        ticket: ticketReducer,
        notifications: notificationReducer,
    },
})
