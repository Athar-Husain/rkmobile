import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import UserService from './UserService'

const errorMessage = (e) =>
    e?.response?.data?.message || e?.message || 'Something went wrong'

export const getDashboard = createAsyncThunk(
    'user/getDashboard',
    async (_, thunkAPI) => {
        try {
            return await UserService.getDashboard()
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const getProfile = createAsyncThunk(
    'user/getProfile',
    async (_, thunkAPI) => {
        try {
            return await UserService.getProfile()
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (data, thunkAPI) => {
        try {
            return await UserService.updateProfile(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

export const validateReferral = createAsyncThunk(
    'user/validateReferral',
    async (code, thunkAPI) => {
        try {
            return await UserService.validateReferralCode(code)
        } catch (e) {
            return thunkAPI.rejectWithValue(errorMessage(e))
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        dashboard: null,
        isLoading: false,
    },
    extraReducers: (builder) => {
        builder

            .addCase(getDashboard.fulfilled, (state, action) => {
                state.dashboard = action.payload
                state.isLoading = false
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.profile = action.payload
                state.isLoading = false
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.profile = action.payload
                state.isLoading = false
                showMessage({ message: 'Profile updated', type: 'success' })
            })
            .addMatcher(
                (a) =>
                    a.type.startsWith('user/') && a.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true
                }
            )
            .addMatcher(
                (a) =>
                    a.type.startsWith('user/') && a.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    showMessage({ message: action.payload, type: 'danger' })
                }
            )
    },
})

export default userSlice.reducer
