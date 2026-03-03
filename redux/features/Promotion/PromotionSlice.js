import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import PromotionService from './PromotionService'
import { safeShowMessage } from '../Auth/AuthSlice'

const initialState = {
    promotions: [],
    featuredPromotions: [],
    promotion: null,
    promotionPagination: {},
    isPromotionLoading: false,
    isPromotionSuccess: false,
    isPromotionError: false,
    message: '',
}

// ================================
// Helper
// ================================
const getErrorMessage = (error) =>
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'

// ================================
// Async Thunks
// ================================

// User
export const fetchActivePromotions = createAsyncThunk(
    'promotion/fetchActive',
    async (params, thunkAPI) => {
        try {
            return await PromotionService.fetchActivePromotions(params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchPromotionsForUser = createAsyncThunk(
    'promotion/fetchForUser',
    async (params, thunkAPI) => {
        try {
            return await PromotionService.fetchPromotionsForUser(params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const recordPromotionImpression = createAsyncThunk(
    'promotion/recordImpression',
    async (id, thunkAPI) => {
        try {
            return await PromotionService.recordImpression(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const recordPromotionClick = createAsyncThunk(
    'promotion/recordClick',
    async (id, thunkAPI) => {
        try {
            return await PromotionService.recordClick(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const recordPromotionRedemption = createAsyncThunk(
    'promotion/recordRedemption',
    async (id, thunkAPI) => {
        try {
            return await PromotionService.recordRedemption(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// Admin
export const createPromotion = createAsyncThunk(
    'promotion/create',
    async (data, thunkAPI) => {
        try {
            return await PromotionService.createPromotion(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updatePromotion = createAsyncThunk(
    'promotion/update',
    async ({ id, data }, thunkAPI) => {
        try {
            return await PromotionService.updatePromotion(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const deletePromotion = createAsyncThunk(
    'promotion/delete',
    async (id, thunkAPI) => {
        try {
            return await PromotionService.deletePromotion(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getAllPromotions = createAsyncThunk(
    'promotion/fetchAll',
    async (params, thunkAPI) => {
        try {
            return await PromotionService.getAllPromotions(params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getPromotionById = createAsyncThunk(
    'promotion/fetchById',
    async (id, thunkAPI) => {
        try {
            return await PromotionService.getPromotionById(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ================================
// Slice
// ================================
const promotionSlice = createSlice({
    name: 'promotion',
    initialState,
    reducers: {
        RESET_PROMOTION_STATE: (state) => {
            state.isPromotionLoading = false
            state.isPromotionSuccess = false
            state.isPromotionError = false
            state.message = ''
        },
        CLEAR_PROMOTION_DETAILS: (state) => {
            state.promotion = null
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchPromotionsForUser.fulfilled, (state, action) => {
                state.isPromotionLoading = false
                state.isPromotionSuccess = true
                state.promotions = action.payload.data || action.payload || [] // Fallback for different API structures
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.isPromotionLoading = true
                    state.isPromotionError = false
                    state.message = ''
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.isPromotionLoading = false
                    state.isPromotionSuccess = true

                    // Handle different fulfilled actions
                    if (
                        action.type.startsWith('promotion/fetchActive') ||
                        action.type.startsWith('promotion/fetchForUser')
                    ) {
                        state.promotions = action.payload.data || []
                    } else if (action.type.startsWith('promotion/fetchAll')) {
                        state.promotions = action.payload.data || []
                        state.promotionPagination = {
                            total: action.payload.total,
                            page: action.payload.page,
                        }
                    } else if (action.type.startsWith('promotion/fetchById')) {
                        state.promotion = action.payload.data
                    }
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isPromotionLoading = false
                    state.isPromotionError = true
                    state.message = action.payload
                    safeShowMessage({ message: action.payload, type: 'danger' })
                }
            )
    },
})

export const { RESET_PROMOTION_STATE, CLEAR_PROMOTION_DETAILS } =
    promotionSlice.actions
export default promotionSlice.reducer
