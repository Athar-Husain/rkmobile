import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message' // For React Native Toast
import ConnectionService from './ConnectionService'

const initialState = {
    connections: [],
    newConnection: null,
    connection: null,
    isConnectionLoading: false,
    isConnectionSuccess: false,
    isConnectionError: false,
    message: '',
}

// Helper to extract error message
const getError = (err) =>
    err?.response?.data?.message || err.message || 'Something went wrong'

// Async Thunks

export const createConnection = createAsyncThunk(
    'connection/create',
    async (data, thunkAPI) => {
        try {
            return await ConnectionService.create(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getAllConnections = createAsyncThunk(
    'connection/getAll',
    async (_, thunkAPI) => {
        try {
            return await ConnectionService.getAll()
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getConnectionById = createAsyncThunk(
    'connection/getById',
    async (id, thunkAPI) => {
        try {
            return await ConnectionService.getById(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const updateConnection = createAsyncThunk(
    'connection/update',
    async ({ id, data }, thunkAPI) => {
        try {
            return await ConnectionService.update(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const deactivateConnection = createAsyncThunk(
    'connection/deactivate',
    async (id, thunkAPI) => {
        try {
            return await ConnectionService.deactivate(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const deleteConnection = createAsyncThunk(
    'connection/delete',
    async (id, thunkAPI) => {
        try {
            return await ConnectionService.delete(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getFilteredConnections = createAsyncThunk(
    'connection/getFiltered',
    async (query, thunkAPI) => {
        try {
            return await ConnectionService.getFiltered(query)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const updateSubscribedPlan = createAsyncThunk(
    'connection/updateSubscribedPlan',
    async (data, thunkAPI) => {
        try {
            return await ConnectionService.updateSubscribedPlan(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getSubscribedPlans = createAsyncThunk(
    'connection/getSubscribedPlans',
    async (connectionId, thunkAPI) => {
        try {
            return await ConnectionService.getSubscribedPlans(connectionId)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getConnectionsForUser = createAsyncThunk(
    'connection/getConnectionsForUser',
    async (_, thunkAPI) => {
        try {
            return await ConnectionService.getConnectionsForUser()
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)
export const getActiveConnection = createAsyncThunk(
    'connection/getActiveConnection',
    async (_, thunkAPI) => {
        try {
            return await ConnectionService.getActiveConnection()
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// Slice

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        resetConnectionState: (state) => {
            state.isConnectionLoading = false
            state.isConnectionError = false
            state.isConnectionSuccess = false
            state.message = ''
            state.connection = null
        },
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createConnection.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                state.newConnection = action.payload.connection
                showMessage({
                    message: 'Connection created successfully!',
                    type: 'success',
                })
            })
            // GET ALL
            .addCase(getAllConnections.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                state.connections = action.payload
            })
            // GET BY ID
            .addCase(getConnectionById.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                state.connection = action.payload
            })
            // UPDATE
            .addCase(updateConnection.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                showMessage({
                    message: 'Connection updated successfully!',
                    type: 'success',
                })
                const index = state.connections.findIndex(
                    (conn) => conn._id === action.payload._id
                )
                if (index !== -1) {
                    state.connections[index] = action.payload
                }
            })
            // DEACTIVATE
            .addCase(deactivateConnection.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                showMessage({
                    message: 'Connection deactivated successfully!',
                    type: 'success',
                })
                const index = state.connections.findIndex(
                    (conn) => conn._id === action.payload._id
                )
                if (index !== -1) {
                    state.connections[index] = action.payload
                }
            })
            // DELETE
            .addCase(deleteConnection.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                showMessage({
                    message: 'Connection deleted successfully!',
                    type: 'success',
                })
                state.connections = state.connections.filter(
                    (conn) => conn._id !== action.meta.arg
                )
            })
            // GET FILTERED
            .addCase(getFilteredConnections.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                state.connections = action.payload
            })
            // GET SUBSCRIBED PLANS
            .addCase(getSubscribedPlans.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                state.connection.subscribedPlans = action.payload
            })
            // GET CONNECTIONS FOR USER
            .addCase(getConnectionsForUser.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                state.connections = action.payload
                // console.log(
                //     'action.payload getConnectionsForUser ',
                //     action.payload
                // )
                // connections
            })
            .addCase(getActiveConnection.fulfilled, (state, action) => {
                state.isConnectionLoading = false
                state.isConnectionSuccess = true
                state.connection = action.payload
                // console.log(
                //     'action.payload getConnectionsForUser ',
                //     action.payload
                // )
                // connections
            })
            // Global pending and rejected matchers
            .addMatcher(
                (action) =>
                    action.type.startsWith('connection/') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isConnectionLoading = true
                    state.isConnectionError = false
                    state.isConnectionSuccess = false
                    state.message = ''
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith('connection/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isConnectionLoading = false
                    state.isConnectionError = true
                    state.isConnectionSuccess = false
                    state.message = action.payload
                    showMessage({ message: action.payload, type: 'danger' })
                }
            )
    },
})

export const { resetConnectionState } = connectionSlice.actions
export default connectionSlice.reducer
