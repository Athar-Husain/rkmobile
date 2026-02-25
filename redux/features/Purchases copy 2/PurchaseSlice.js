import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import PurchaseService from './PurchaseService'
import { safeShowMessage } from '../Auth/AuthSlice'

const initialState = {
    purchases: [],
    mypurchases: [],
    purchase: null,
    staffPOSSummary: null,
    reports: null,
    isPurchaseLoading: false,
    isPurchaseSuccess: false,
    isPurchaseError: false,
    message: '',
}

// ----------------
// Helper
// ----------------
const getErrorMessage = (error) =>
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'

// ----------------
// Async Thunks
// ----------------

// USER
export const getMyPurchases = createAsyncThunk(
    'purchase/getMyPurchases',
    async (_, thunkAPI) => {
        try {
            return await PurchaseService.getMyPurchases()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getPurchaseById = createAsyncThunk(
    'purchase/getPurchaseById',
    async (id, thunkAPI) => {
        try {
            return await PurchaseService.getPurchaseById(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const addRating = createAsyncThunk(
    'purchase/addRating',
    async ({ id, data }, thunkAPI) => {
        try {
            return await PurchaseService.addRating(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateFeedback = createAsyncThunk(
    'purchase/updateFeedback',
    async ({ id, data }, thunkAPI) => {
        try {
            return await PurchaseService.updateFeedback(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// STAFF POS
export const previewPurchase = createAsyncThunk(
    'purchase/previewPurchase',
    async (payload, thunkAPI) => {
        try {
            return await PurchaseService.previewPurchase(payload)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const recordPurchase = createAsyncThunk(
    'purchase/recordPurchase',
    async (payload, thunkAPI) => {
        try {
            return await PurchaseService.recordPurchase(payload)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getStorePurchases = createAsyncThunk(
    'purchase/getStorePurchases',
    async (storeId, thunkAPI) => {
        try {
            return await PurchaseService.getStorePurchases(storeId)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updatePurchaseStatus = createAsyncThunk(
    'purchase/updatePurchaseStatus',
    async ({ id, data }, thunkAPI) => {
        try {
            return await PurchaseService.updatePurchaseStatus(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const cancelPurchase = createAsyncThunk(
    'purchase/cancelPurchase',
    async ({ id, data }, thunkAPI) => {
        try {
            return await PurchaseService.cancelPurchase(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// REPORTS
export const getStoreSalesReport = createAsyncThunk(
    'purchase/getStoreSalesReport',
    async (storeId, thunkAPI) => {
        try {
            return await PurchaseService.getStoreSalesReport(storeId)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getUserSpendingReport = createAsyncThunk(
    'purchase/getUserSpendingReport',
    async (userId, thunkAPI) => {
        try {
            return await PurchaseService.getUserSpendingReport(userId)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ADMIN
export const getAllPurchases = createAsyncThunk(
    'purchase/getAllPurchases',
    async (_, thunkAPI) => {
        try {
            return await PurchaseService.getAllPurchases()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const refundPurchase = createAsyncThunk(
    'purchase/refundPurchase',
    async ({ id, data }, thunkAPI) => {
        try {
            return await PurchaseService.refundPurchase(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const deletePurchase = createAsyncThunk(
    'purchase/deletePurchase',
    async (id, thunkAPI) => {
        try {
            return await PurchaseService.deletePurchase(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ----------------
// Slice
// ----------------
const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        RESET_PURCHASE_STATE: (state) => {
            state.isPurchaseLoading = false
            state.isPurchaseSuccess = false
            state.isPurchaseError = false
            state.message = ''
        },
        CLEAR_PURCHASE: (state) => {
            state.purchase = null
        },
        clearPOSSummary: (state) => {
            state.staffPOSSummary = null
        },
    },
    extraReducers: (builder) => {
        builder
            // USER
            .addCase(getMyPurchases.fulfilled, (state, action) => {
                state.mypurchases = action.payload.purchases
            })
            .addCase(getAllPurchases.fulfilled, (state, action) => {
                state.purchases = action.payload.purchases || action.payload
            })
            .addCase(getPurchaseById.fulfilled, (state, action) => {
                state.purchase = action.payload.purchase
            })

            // STAFF POS
            .addCase(previewPurchase.fulfilled, (state, action) => {
                state.staffPOSSummary = action.payload
            })
            .addCase(recordPurchase.fulfilled, (state, action) => {
                state.message = action.payload.message
                safeShowMessage({
                    message: action.payload.message,
                    type: 'success',
                })
            })

            // REPORTS
            .addCase(getStoreSalesReport.fulfilled, (state, action) => {
                state.reports = action.payload
            })
            .addCase(getUserSpendingReport.fulfilled, (state, action) => {
                state.reports = action.payload
            })

            // REFUND
            .addCase(refundPurchase.fulfilled, (state, action) => {
                state.message = action.payload.message
                safeShowMessage({
                    message: action.payload.message,
                    type: 'success',
                })
            })

            // Global matchers
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.isPurchaseLoading = true
                    state.isPurchaseError = false
                    state.message = ''
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.isPurchaseLoading = false
                    state.isPurchaseSuccess = true
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isPurchaseLoading = false
                    state.isPurchaseError = true
                    state.message = action.payload
                    safeShowMessage({ message: action.payload, type: 'danger' })
                }
            )
    },
})

export const { RESET_PURCHASE_STATE, CLEAR_PURCHASE, clearPOSSummary } =
    purchaseSlice.actions

export default purchaseSlice.reducer
