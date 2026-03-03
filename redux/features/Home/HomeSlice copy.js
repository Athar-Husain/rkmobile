import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HomeService from './HomeService'
import { safeShowMessage } from '../Auth/AuthSlice'

// Async thunks
export const fetchDashboardData = createAsyncThunk(
    'home/fetchDashboardData',
    async (_, thunkAPI) => {
        try {
            const response = await HomeService.getDashboard()
            return response.data
        } catch (e) {
            const message = e?.response?.data?.message || 'Failed to fetch dashboard'
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const initialState = {
    banners: [],
    promotions: [],
    categories: [],
    quickAccess: [],
    featuredProducts: [],
    isLoading: false,
    error: null,
}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearHomeError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.isLoading = false
                const payload = action.payload || {}
                state.banners = payload.banners || []
                state.promotions = payload.promotions || []
                state.categories = payload.categories || []
                state.quickAccess = payload.quickAccess || []
                state.featuredProducts = payload.featuredProducts || []
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { clearHomeError } = homeSlice.actions
export default homeSlice.reducer
