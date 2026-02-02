import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import CouponService from './CouponService'
import { safeShowMessage } from '../Auth/AuthSlice'

const initialState = {
    discoverCoupons: [], // Tab 1
    activeCoupons: [], // Tab 2
    historyCoupons: [], // Tab 3
    userSavings: { totalAmount: 0, count: 0 },
    coupons: [], // Admin view
    isCouponLoading: false,
    isCouponError: false,
    message: '',
}

const getErrorMessage = (error) =>
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'

// --- THUNKS ---

export const fetchDiscoverCoupons = createAsyncThunk(
    'coupon/user/fetchDiscover',
    async (_, thunkAPI) => {
        try {
            return await CouponService.getDiscoverableCoupons()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchActiveCoupons = createAsyncThunk(
    'coupon/user/fetchActive',
    async (_, thunkAPI) => {
        try {
            return await CouponService.getActiveCoupons()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchHistoryCoupons = createAsyncThunk(
    'coupon/user/fetchHistory',
    async (_, thunkAPI) => {
        try {
            return await CouponService.getCouponHistory()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchUserSavings = createAsyncThunk(
    'coupon/user/fetchSavings',
    async (_, thunkAPI) => {
        try {
            return await CouponService.getCouponSavings()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const claimCouponUser = createAsyncThunk(
    'coupon/user/claimCoupon',
    async (id, thunkAPI) => {
        try {
            const response = await CouponService.claimCoupon(id)
            // Refresh discover and active lists after a successful claim
            thunkAPI.dispatch(fetchDiscoverCoupons())
            thunkAPI.dispatch(fetchActiveCoupons())
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const validateForStaffAction = createAsyncThunk(
    'coupon/staff/validate',
    async (data, thunkAPI) => {
        try {
            return await CouponService.validateForStaff(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const redeemCouponStaff = createAsyncThunk(
    'coupon/staff/redeem',
    async (data, thunkAPI) => {
        try {
            return await CouponService.redeemCoupon(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// --- SLICE ---

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        RESET_COUPON_STATE: (state) => {
            state.isCouponLoading = false
            state.isCouponError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiscoverCoupons.fulfilled, (state, action) => {
                state.isCouponLoading = false
                state.discoverCoupons = action.payload.coupons
            })
            .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
                state.isCouponLoading = false
                state.activeCoupons = action.payload.coupons
            })
            .addCase(fetchHistoryCoupons.fulfilled, (state, action) => {
                state.isCouponLoading = false
                state.historyCoupons = action.payload.coupons
            })
            .addCase(fetchUserSavings.fulfilled, (state, action) => {
                state.userSavings = action.payload.savings
            })
            .addCase(claimCouponUser.fulfilled, (state) => {
                state.isCouponLoading = false
                safeShowMessage({
                    message: 'Coupon added to your wallet!',
                    type: 'success',
                })
            })
            .addCase(redeemCouponStaff.fulfilled, (state) => {
                state.isCouponLoading = false
                safeShowMessage({
                    message: 'Redemption Successful!',
                    type: 'success',
                })
            })
            // Global Loaders
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.isCouponLoading = true
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
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
