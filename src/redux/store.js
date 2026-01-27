import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import shopReducer from './slices/shopSlice'
import walletReducer from './slices/walletSlice'
import supportReducer from './slices/supportSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        shop: shopReducer,
        wallet: walletReducer,
        support: supportReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
