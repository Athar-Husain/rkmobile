import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import StoreService from './StoreService'
import { safeShowMessage } from '../Auth/AuthSlice'

// ================================
// Initial State
// ================================
const initialState = {
    stores: [],
    store: null,
    nearbyStores: [],
    storeDashboard: null,

    isStoreLoading: false,
    isStoreSuccess: false,
    isStoreError: false,
    message: '',
}

// ================================
// Helper: Extract error message
// ================================
const getErrorMessage = (error) =>
    error?.response?.data?.message || error?.message || 'Something went wrong'

// ================================
// Async Thunks
// ================================

// ---------- PUBLIC ----------

// Get all active stores
export const fetchStores = createAsyncThunk(
    'store/fetchStores',
    async (params, thunkAPI) => {
        try {
            return await StoreService.getStores(params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// Get single store (public)
export const fetchStoreById = createAsyncThunk(
    'store/fetchStoreById',
    async (id, thunkAPI) => {
        try {
            return await StoreService.getStoreById(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// Get store hours
export const fetchStoreHours = createAsyncThunk(
    'store/fetchStoreHours',
    async (id, thunkAPI) => {
        try {
            return await StoreService.getStoreHours(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// Get nearby stores
export const fetchNearbyStores = createAsyncThunk(
    'store/fetchNearbyStores',
    async (params, thunkAPI) => {
        try {
            return await StoreService.getNearbyStores(params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ---------- STAFF ----------

// Staff login
export const staffLogin = createAsyncThunk(
    'store/staffLogin',
    async (credentials, thunkAPI) => {
        try {
            return await StoreService.staffLogin(credentials)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// Staff dashboard
export const getStoreDashboard = createAsyncThunk(
    'store/getStoreDashboard',
    async (id, thunkAPI) => {
        try {
            return await StoreService.getDashboard(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ---------- ADMIN ----------

export const createStoreAdmin = createAsyncThunk(
    'store/admin/createStore',
    async (data, thunkAPI) => {
        try {
            return await StoreService.createStore(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchAllStoresAdmin = createAsyncThunk(
    'store/admin/fetchAllStores',
    async (_, thunkAPI) => {
        try {
            return await StoreService.getAllStoresAdmin()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchStoreByIdAdmin = createAsyncThunk(
    'store/admin/fetchStoreById',
    async (id, thunkAPI) => {
        try {
            return await StoreService.getStoreByIdAdmin(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateStoreAdmin = createAsyncThunk(
    'store/admin/updateStore',
    async ({ id, data }, thunkAPI) => {
        try {
            return await StoreService.updateStore(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const toggleStoreStatusAdmin = createAsyncThunk(
    'store/admin/toggleStoreStatus',
    async (id, thunkAPI) => {
        try {
            return await StoreService.toggleStoreStatus(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ================================
// Slice
// ================================
const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        RESET_STORE_STATE: (state) => {
            state.isStoreLoading = false
            state.isStoreSuccess = false
            state.isStoreError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder

            // ===== PUBLIC =====
            .addCase(fetchStores.pending, (state) => {
                state.isStoreLoading = true
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.isStoreLoading = false
                state.isStoreSuccess = true
                state.stores = action.payload.stores
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.isStoreLoading = false
                state.isStoreError = true
                state.message = action.payload
                safeShowMessage({ message: action.payload, type: 'danger' })
            })

            .addCase(fetchStoreById.fulfilled, (state, action) => {
                state.store = action.payload.store
            })

            .addCase(fetchStoreHours.fulfilled, (state, action) => {
                if (state.store) {
                    state.store.hours = action.payload.hours
                }
            })

            .addCase(fetchNearbyStores.fulfilled, (state, action) => {
                state.nearbyStores = action.payload.stores
            })

            // ===== STAFF =====
            .addCase(staffLogin.fulfilled, (state) => {
                state.isStoreSuccess = true
                safeShowMessage({
                    message: 'Staff logged in successfully',
                    type: 'success',
                })
            })

            .addCase(getStoreDashboard.fulfilled, (state, action) => {
                state.storeDashboard = action.payload.dashboard
            })

            // ===== ADMIN =====
            .addCase(fetchAllStoresAdmin.fulfilled, (state, action) => {
                state.stores = action.payload.stores
            })

            .addCase(fetchStoreByIdAdmin.fulfilled, (state, action) => {
                state.store = action.payload.store
            })

            .addCase(createStoreAdmin.fulfilled, (state, action) => {
                state.stores.push(action.payload.store)
                safeShowMessage({
                    message: 'Store created successfully',
                    type: 'success',
                })
            })

            .addCase(updateStoreAdmin.fulfilled, (state, action) => {
                const index = state.stores.findIndex(
                    (s) => s._id === action.payload.store._id
                )
                if (index !== -1) {
                    state.stores[index] = action.payload.store
                }
                safeShowMessage({
                    message: 'Store updated successfully',
                    type: 'success',
                })
            })

            .addCase(toggleStoreStatusAdmin.fulfilled, (state, action) => {
                const index = state.stores.findIndex(
                    (s) => s._id === action.payload._id
                )
                if (index !== -1) {
                    state.stores[index].isActive = action.payload.isActive
                }
                safeShowMessage({
                    message: `Store ${
                        action.payload.isActive ? 'activated' : 'deactivated'
                    }`,
                    type: 'info',
                })
            })
    },
})

export const { RESET_STORE_STATE } = storeSlice.actions
export default storeSlice.reducer
