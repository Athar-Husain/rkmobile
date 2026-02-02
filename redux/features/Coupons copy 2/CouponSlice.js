import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { toast } from 'react-toastify'
// import { showMessage } from 'react-native-flash-message'
import CouponService from './CouponService'
import { safeShowMessage } from '../Auth/AuthSlice'

// ================================
// Initial State
// ================================
const initialState = {
    coupons: [],
    myCoupons: [],
    coupon: null,
    redemptionHistory: [],
    analytics: [],
    isCouponLoading: false,
    isCouponSuccess: false,
    isCouponError: false,
    message: '',
}

// ================================
// Helper: Extract error messages
// ================================
const getErrorMessage = (error) =>
    error?.response?.data?.message || error?.message || 'Something went wrong'

// ================================
// Async Thunks
// ================================

// ----------------
// Admin
// ----------------
export const createCouponAdmin = createAsyncThunk(
    'coupon/admin/create',
    async (data, thunkAPI) => {
        try {
            return await CouponService.createCoupon(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createCoupon2Admin = createAsyncThunk(
    'coupon/admin/create2',
    async (data, thunkAPI) => {
        try {
            return await CouponService.createCoupon2(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchAllCouponsAdmin = createAsyncThunk(
    'coupon/admin/fetchAll',
    async (_, thunkAPI) => {
        try {
            return await CouponService.getAllCouponsAdmin()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateCouponAdmin = createAsyncThunk(
    'coupon/admin/update',
    async ({ id, data }, thunkAPI) => {
        try {
            return await CouponService.updateCoupon(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getCouponAnalyticsAdmin = createAsyncThunk(
    'coupon/admin/analytics',
    async (_, thunkAPI) => {
        try {
            return await CouponService.getCouponAnalytics()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchRedemptionHistoryAdmin = createAsyncThunk(
    'coupon/admin/redemptionHistory',
    async ({ id, params }, thunkAPI) => {
        try {
            return await CouponService.getRedemptionHistory(id, params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ----------------
// User
// ----------------
export const fetchMyCoupons = createAsyncThunk(
    'coupon/user/fetchMyCoupons',
    async (params, thunkAPI) => {
        try {
            return await CouponService.getMyCoupons(params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchCouponById = createAsyncThunk(
    'coupon/user/fetchCouponById',
    async (id, thunkAPI) => {
        try {
            return await CouponService.getCouponById(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const claimCouponUser = createAsyncThunk(
    'coupon/user/claimCoupon',
    async (id, thunkAPI) => {
        try {
            return await CouponService.claimCoupon(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ----------------
// Store Staff
// ----------------
export const validateCouponStaff = createAsyncThunk(
    'coupon/staff/validateCoupon',
    async (data, thunkAPI) => {
        try {
            return await CouponService.validateCoupon(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const validateForStaff = createAsyncThunk(
    'coupon/staff/validateForStaff',
    async (data, thunkAPI) => {
        try {
            return await CouponService.validateForStaff(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const redeemCouponStaff = createAsyncThunk(
    'coupon/staff/redeemCoupon',
    async (data, thunkAPI) => {
        try {
            return await CouponService.redeemCoupon(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ================================
// Slice
// ================================
const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        RESET_COUPON_STATE: (state) => {
            state.isCouponLoading = false
            state.isCouponSuccess = false
            state.isCouponError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            // ----------------
            // Admin
            // ----------------
            .addCase(createCouponAdmin.fulfilled, (state, action) => {
                state.coupons.push(action.payload.coupon)
                // toast.success('Coupon created successfully')
                safeShowMessage({
                    message: 'Coupon created successfully!',
                    type: 'success',
                    duration: 3000,
                })
            })
            .addCase(createCoupon2Admin.fulfilled, (state, action) => {
                state.coupons.push(action.payload.coupon)
                // toast.success('Coupon created successfully (v2)')
            })
            .addCase(fetchAllCouponsAdmin.fulfilled, (state, action) => {
                state.coupons = action.payload.coupons
            })
            .addCase(updateCouponAdmin.fulfilled, (state, action) => {
                const index = state.coupons.findIndex(
                    (c) => c._id === action.payload.coupon._id
                )
                if (index !== -1) state.coupons[index] = action.payload.coupon
                // toast.success('Coupon updated successfully')
            })
            .addCase(getCouponAnalyticsAdmin.fulfilled, (state, action) => {
                state.analytics = action.payload.analytics
            })
            .addCase(fetchRedemptionHistoryAdmin.fulfilled, (state, action) => {
                state.redemptionHistory = action.payload.redemptions
            })

            // ----------------
            // User
            // ----------------
            .addCase(fetchMyCoupons.fulfilled, (state, action) => {
                state.myCoupons = action.payload.coupons
            })
            .addCase(fetchCouponById.fulfilled, (state, action) => {
                state.coupon = action.payload.coupon
            })
            .addCase(claimCouponUser.fulfilled, (state, action) => {
                state.myCoupons.push(action.payload.userCoupon)
                // toast.success('Coupon claimed successfully')

                safeShowMessage({
                    message: 'Coupon claimed successfully!',
                    type: 'success',
                    duration: 3000,
                })
            })

            // ----------------
            // Store Staff
            // ----------------
            .addCase(validateCouponStaff.fulfilled, (state, action) => {
                // toast.success('Coupon validated successfully')
                safeShowMessage({
                    message: 'Coupon validated successfully!',
                    type: 'success',
                    duration: 3000,
                })
            })
            .addCase(validateForStaff.fulfilled, (state, action) => {
                // toast.success('Coupon validated for staff')
                safeShowMessage({
                    message: 'Coupon validated for Staff!',
                    type: 'success',
                    duration: 3000,
                })
            })
            .addCase(redeemCouponStaff.fulfilled, (state, action) => {
                // toast.success('Coupon redeemed successfully')
                safeShowMessage({
                    message: 'Coupon redeemed successfully!',
                    type: 'success',
                    duration: 3000,
                })
            })

            // ----------------
            // Error handling
            // ----------------

            .addMatcher(
                (action) =>
                    action.type.startsWith('coupon/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isCouponLoading = false
                    state.isCouponError = action.payload

                    // Don't show message for silent errors or initialization

                    safeShowMessage({
                        message: action.payload,
                        type: 'danger',
                        duration: 4000,
                    })
                }
            )

            .addMatcher(
                (action) =>
                    action.type.startsWith('coupon/') &&
                    action.type.endsWith('/pending'),
                (state, action) => {
                    // Don't set loading for initialization
                    state.isCouponLoading = true
                    state.isCouponError = false
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.isCouponLoading = false
                    state.isCouponSuccess = true
                }
            )
    },
})

export const { RESET_COUPON_STATE } = couponSlice.actions
export default couponSlice.reducer
