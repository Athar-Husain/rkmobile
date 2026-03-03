import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HomeService from './HomeService'

// ===============================
// Async Thunks
// ===============================
export const fetchActivePromotions = createAsyncThunk(
    'home/fetchActivePromotions',
    async (_, thunkAPI) => {
        try {
            const response = await HomeService.getActivePromotions()
            return response.promotions || []
        } catch (e) {
            return thunkAPI.rejectWithValue('Failed to fetch active promotions')
        }
    }
)

export const fetchFeaturedPromotions = createAsyncThunk(
    'home/fetchFeaturedPromotions',
    async (_, thunkAPI) => {
        try {
            const response = await HomeService.getFeaturedPromotions()
            return response.promotions || []
        } catch (e) {
            return thunkAPI.rejectWithValue(
                'Failed to fetch featured promotions'
            )
        }
    }
)

export const fetchActiveBanners = createAsyncThunk(
    'home/fetchActiveBanners',
    async (_, thunkAPI) => {
        try {
            const response = await HomeService.getActiveBanners()
            return response.banners || []
        } catch (e) {
            return thunkAPI.rejectWithValue('Failed to fetch active banners')
        }
    }
)

export const fetchFeaturedBanners = createAsyncThunk(
    'home/fetchFeaturedBanners',
    async (_, thunkAPI) => {
        try {
            const response = await HomeService.getFeaturedBanners()
            return response.banners || []
        } catch (e) {
            return thunkAPI.rejectWithValue('Failed to fetch featured banners')
        }
    }
)

// ===============================
// Initial State
// ===============================
const initialState = {
    activePromotions: [],
    featuredPromotions: [],
    activeBanners: [],
    featuredBanners: [],
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
            // Active promotions
            .addCase(fetchActivePromotions.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchActivePromotions.fulfilled, (state, action) => {
                state.isLoading = false
                state.activePromotions = action.payload
            })
            .addCase(fetchActivePromotions.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })

            // Featured promotions
            .addCase(fetchFeaturedPromotions.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchFeaturedPromotions.fulfilled, (state, action) => {
                state.isLoading = false
                state.featuredPromotions = action.payload
            })
            .addCase(fetchFeaturedPromotions.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })

            // Active banners
            .addCase(fetchActiveBanners.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchActiveBanners.fulfilled, (state, action) => {
                state.isLoading = false
                state.activeBanners = action.payload
            })
            .addCase(fetchActiveBanners.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })

            // Featured banners
            .addCase(fetchFeaturedBanners.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchFeaturedBanners.fulfilled, (state, action) => {
                state.isLoading = false
                state.featuredBanners = action.payload
            })
            .addCase(fetchFeaturedBanners.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    },
})

export const { clearHomeError } = homeSlice.actions
export default homeSlice.reducer
