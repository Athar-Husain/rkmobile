// redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Import all your reducers
// import customerReducer from './features/Customers/CustomerSlice'
// import connectionReducer from './features/Connection/ConnectionSlice'
// import planReducer from './features/Plan/PlanSlice'
// import ticketReducer from './features/Tickets/TicketSlice'
import notificationReducer from './features/Notifications/NotificationSlice'
import authReducer from './features/Auth/AuthSlice'
import userReducer from './features/Users/UserSlice'
import cityAreaReducer from './features/CityAreas/CityAreaSlice'
import couponReducer from './features/Coupons/CouponSlice'
import storeReducer from './features/Stores/StoreSlice'

// Define persist configs
const persistConfigs = {
    auth: {
        key: 'auth',
        storage: AsyncStorage,
        whitelist: ['user', 'isLoggedIn', 'hasCompletedOnboarding'],
    },
    notifications: {
        key: 'notifications',
        storage: AsyncStorage,
        whitelist: ['list'], // adjust based on your notification state
    },
}

// All reducers
const reducers = {
    auth: authReducer,
    notifications: notificationReducer,
    // customer: customerReducer,
    // connection: connectionReducer,
    // plan: planReducer,
    // ticket: ticketReducer,
    user: userReducer,
    cityarea: cityAreaReducer,
    coupon: couponReducer,
    store: storeReducer,
}

// Wrap reducers that need persistence automatically
const persistedReducers = Object.fromEntries(
    Object.entries(reducers).map(([key, reducer]) => {
        if (persistConfigs[key]) {
            return [key, persistReducer(persistConfigs[key], reducer)]
        }
        return [key, reducer]
    })
)

// Configure store
export const store = configureStore({
    reducer: persistedReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
})

// Create persistor
export const persistor = persistStore(store)
