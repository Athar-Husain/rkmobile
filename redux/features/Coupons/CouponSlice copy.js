import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import CouponService from './CouponService'
import { safeShowMessage } from '../Auth/AuthSlice'

const initialState = {
    coupons: [], // Admin view
    myCoupons: [], // User discovery/active view
    coupon: null, // Single coupon detail
    redemptionHistory: [],
    analytics: [],
    isCouponLoading: false,
    isCouponSuccess: false,
    isCouponError: false,
    message: '',
}

const getErrorMessage = (error) =>
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'

// ASYNC THUNKS - ADMIN
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

// ASYNC THUNKS - USER
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

// ASYNC THUNKS - STAFF
export const validateForStaffAction = createAsyncThunk(
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
            // FETCH MY COUPONS (DISCOVERY)
            .addCase(fetchMyCoupons.fulfilled, (state, action) => {
                state.isCouponLoading = false
                state.myCoupons = action.payload.coupons
            })

            // CLAIM COUPON
            .addCase(claimCouponUser.fulfilled, (state, action) => {
                state.isCouponLoading = false
                // Update the master list: find the coupon and attach the userCoupon data
                const index = state.myCoupons.findIndex(
                    (c) =>
                        c._id === action.payload.data?._id ||
                        action.payload.coupon?._id
                )
                if (index !== -1) {
                    state.myCoupons[index].userCoupon =
                        action.payload.userCoupon
                }
                safeShowMessage({
                    message: 'Coupon claimed successfully!',
                    type: 'success',
                })
            })

            // STAFF VALIDATION
            .addCase(validateForStaffAction.fulfilled, (state, action) => {
                state.isCouponLoading = false
                safeShowMessage({
                    message: 'Coupon Validated for Staff!',
                    type: 'success',
                })
            })

            // STAFF REDEMPTION
            .addCase(redeemCouponStaff.fulfilled, (state, action) => {
                state.isCouponLoading = false
                safeShowMessage({
                    message: 'Coupon Redeemed Successfully!',
                    type: 'success',
                })
            })

            // GLOBAL MATCHER FOR PENDING/REJECTED
            .addMatcher(
                (action) =>
                    action.type.startsWith('coupon/') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isCouponLoading = true
                    state.isCouponError = false
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith('coupon/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isCouponLoading = false
                    state.isCouponError = true
                    safeShowMessage({ message: action.payload, type: 'danger' })
                }
            )
    },
})

export const { RESET_COUPON_STATE } = couponSlice.actions
export default couponSlice.reducer
