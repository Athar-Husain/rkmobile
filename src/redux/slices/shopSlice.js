import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchShops = createAsyncThunk(
    'shop/fetchShops',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/store/getStores')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const fetchNearbyShops = createAsyncThunk(
    'shop/fetchNearbyShops',
    async (location, { rejectWithValue }) => {
        try {
            const response = await api.get('/store/nearby', {
                params: location,
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        shops: [],
        nearbyShops: [],
        selectedShop: null,
        loading: false,
        error: null,
    },
    reducers: {
        selectShop: (state, action) => {
            state.selectedShop = action.payload
        },
        clearSelectedShop: (state) => {
            state.selectedShop = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShops.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchShops.fulfilled, (state, action) => {
                state.loading = false
                state.shops = action.payload
            })
            .addCase(fetchShops.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchNearbyShops.fulfilled, (state, action) => {
                state.nearbyShops = action.payload
            })
    },
})

export const { selectShop, clearSelectedShop } = shopSlice.actions
export default shopSlice.reducer
