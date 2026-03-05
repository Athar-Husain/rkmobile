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
import notificationReducer from './features/Notifications/NotificationSlice'
import authReducer from './features/Auth/AuthSlice'
import userReducer from './features/Users/UserSlice'
import cityAreaReducer from './features/CityAreas/CityAreaSlice'
import couponReducer from './features/Coupons/CouponSlice'
import storeReducer from './features/Stores/StoreSlice'
import purchaseReducer from './features/Purchases/PurchaseSlice'
import productReducer from './features/Products/ProductSlice'
import homeReducer from './features/Home/HomeSlice'
import promotionReducer from './features/Promotion/PromotionSlice'

// Import Promotion Slice

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
    home: {
        key: 'home',
        storage: AsyncStorage,
        whitelist: [
            'banners',
            'promotions',
            'categories',
            'quickAccess',
            'featuredProducts',
        ],
    },
    promotions: {
        key: 'promotions',
        storage: AsyncStorage,
        whitelist: ['promotions', 'featuredPromotions', 'isLoading', 'message'],
    },
}

// All reducers
const reducers = {
    auth: authReducer,
    notifications: notificationReducer,
    user: userReducer,
    cityarea: cityAreaReducer,
    coupon: couponReducer,
    store: storeReducer,
    purchase: purchaseReducer,
    home: homeReducer,
    product: productReducer,
    promotions: promotionReducer, // added promotion slice
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
