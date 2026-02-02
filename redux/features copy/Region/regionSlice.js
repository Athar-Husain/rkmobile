// regionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import regionService from './regionService';
import regionService from './regionService';

// Thunks for async API calls

export const addServiceArea = createAsyncThunk('serviceArea/add', async (userData, { rejectWithValue }) => {
  try {
    return await regionService.add(userData);
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getAllServiceAreas = createAsyncThunk('serviceArea/getAll', async (_, { rejectWithValue }) => {
  try {
    return await regionService.getAll();
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getServiceAreaById = createAsyncThunk('serviceArea/getById', async (id, { rejectWithValue }) => {
  try {
    return await regionService.getById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateServiceArea = createAsyncThunk('serviceArea/update', async ({ id, userData }, { rejectWithValue }) => {
  try {
    return await regionService.update(id, userData);
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteServiceArea = createAsyncThunk('serviceArea/delete', async (id, { rejectWithValue }) => {
  try {
    return await regionService.delete(id);
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Initial state
// const initialState = {
//   items: [],
//   current: null,
//   loading: false,
//   error: null
// };
const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedRegion: null // ✅ For view/edit
};

// Slice definition
const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllServiceAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllServiceAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllServiceAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getServiceAreaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceAreaById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRegion = action.payload;
      })
      .addCase(getServiceAreaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addServiceArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addServiceArea.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addServiceArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateServiceArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceArea.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        // if (index !== -1) {
        //   state.items[index] = action.payload;
        // }
        state.selectedRegion = action.payload;
      })
      .addCase(updateServiceArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteServiceArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServiceArea.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload._id);
      })
      .addCase(deleteServiceArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions and reducer
export const { clearError, clearCurrent } = regionSlice.actions;
export default regionSlice.reducer;
