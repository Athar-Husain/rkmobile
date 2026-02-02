import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import DeviceService from './DeviceService'

export const registerDevice = createAsyncThunk(
    'device/register',
    async (data) => {
        return await DeviceService.registerDevice(data)
    }
)

const deviceSlice = createSlice({
    name: 'device',
    initialState: { registered: false },
    extraReducers: (builder) => {
        builder.addCase(registerDevice.fulfilled, (state) => {
            state.registered = true
        })
    },
})

export default deviceSlice.reducer
