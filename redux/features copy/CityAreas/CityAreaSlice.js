import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import CityAreaService from './CityAreaService'
import { showMessage } from 'react-native-flash-message'

/* ===============================
   Initial State
================================ */
const initialState = {
    cities: [],
    areas: [],
    cityDetails: null,

    isLocationLoading: false,
    isLocationSuccess: false,
    isLocationError: false,
    locationMessage: '',
}

/* ===============================
   Helpers
================================ */
const getErrorMessage = (error) =>
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'

/* ===============================
   Thunks
================================ */

/* --- Public / Mobile --- */
export const getCities = createAsyncThunk(
    'cityArea/getCities',
    async (_, thunkAPI) => {
        try {
            return await CityAreaService.getCities()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getAreasByCity = createAsyncThunk(
    'cityArea/getAreasByCity',
    async (city, thunkAPI) => {
        try {
            return await CityAreaService.getAreasByCity(city)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const validateCityArea = createAsyncThunk(
    'cityArea/validate',
    async (data, thunkAPI) => {
        try {
            return await CityAreaService.validateCityArea(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

/* --- Admin --- */
export const createCity = createAsyncThunk(
    'cityArea/createCity',
    async (data, thunkAPI) => {
        try {
            return await CityAreaService.createCity(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const addAreasToCity = createAsyncThunk(
    'cityArea/addAreasToCity',
    async ({ city, areas }, thunkAPI) => {
        try {
            return await CityAreaService.addAreasToCity(city, { areas })
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

/* ===============================
   Slice
================================ */
const cityAreaSlice = createSlice({
    name: 'cityArea',
    initialState,
    reducers: {
        CITY_AREA_RESET: (state) => {
            state.isLocationLoading = false
            state.isLocationSuccess = false
            state.isLocationError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder

            /* ================= Cities ================= */
            .addCase(getCities.pending, (state) => {
                state.isLocationLoading = true
            })
            .addCase(getCities.fulfilled, (state, action) => {
                state.isLocationLoading = false

                state.cities = action.payload.data
                // console.log('action payload', action.payload)
            })
            .addCase(getCities.rejected, (state, action) => {
                state.isLocationLoading = false
                state.isLocationError = true
                showMessage({ message: action.payload, type: 'danger' })
            })

            /* ================= Areas ================= */
            .addCase(getAreasByCity.fulfilled, (state, action) => {
                // console.log()
                state.areas = action.payload.areas || []
            })

            /* ================= Admin ================= */
            .addCase(createCity.fulfilled, () => {
                showMessage({
                    message: 'City created successfully',
                    type: 'success',
                })
            })
            .addCase(addAreasToCity.fulfilled, () => {
                showMessage({
                    message: 'Areas added successfully',
                    type: 'success',
                })
            })
            .addMatcher(
                (a) =>
                    a.type.startsWith('auth/') && a.type.endsWith('/pending'),
                (state) => {
                    state.isLocationLoading = true
                    state.error = null
                }
            )
            .addMatcher(
                (a) =>
                    a.type.startsWith('auth/') && a.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLocationLoading = false
                    state.error = action.payload
                    showMessage({ message: action.payload, type: 'danger' })
                }
            )
    },
})

export const { CITY_AREA_RESET } = cityAreaSlice.actions
export default cityAreaSlice.reducer
