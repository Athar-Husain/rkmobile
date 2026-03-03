import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HomeService from './HomeService'

// ===============================
// Async Thunk
// ===============================
export const fetchDashboardData = createAsyncThunk(
    'home/fetchDashboardData',
    async (_, thunkAPI) => {
        try {
            const response = await HomeService.getDashboard()

            console.log('API RESPONSE:', response)

            // response already equals response.data
            return response.dashboard || {}
        } catch (e) {
            const message =
                e?.response?.data?.message || 'Failed to fetch dashboard'
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// ===============================
// Initial State
// ===============================
const initialState = {
    dashboard: {
        banners: [],
        featuredPromotions: [],
        activePromotions: [],
        trendingProducts: [],
        quickAccess: [],
        userData: null,
    },
    isLoading: false,
    error: null,
}

// ===============================
// Slice
// ===============================
const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearHomeError: (state) => {
            state.error = null
        },
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

                state.dashboard = {
                    banners: payload.banners || [],
                    featuredPromotions: payload.featuredPromotions || [],
                    activePromotions: payload.activePromotions || [],
                    trendingProducts: payload.trendingProducts || [],
                    quickAccess: payload.quickAccess || [],
                    userData: payload.userData || null,
                }
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    },
})

export const { clearHomeError } = homeSlice.actions
export default homeSlice.reducer
