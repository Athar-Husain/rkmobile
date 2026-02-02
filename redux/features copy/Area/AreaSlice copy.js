// src/features/serviceArea/serviceAreaSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import AreaService from './AreaService';

const initialState = {
  areas: [],
  area: null,
  total: 0,
  isAreaLoading: false,
  isAreaSuccess: false,
  isAreaError: false,
  message: ''
};

// Helper to get error message
const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

// Thunks
export const createServiceArea = createAsyncThunk('serviceArea/create', async (data, thunkAPI) => {
  try {
    return await AreaService.create(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getAllServiceAreas = createAsyncThunk('serviceArea/getAll', async (_, thunkAPI) => {
  try {
    return await AreaService.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getActiveServiceAreas = createAsyncThunk('serviceArea/getActive', async (_, thunkAPI) => {
  try {
    return await AreaService.getActive();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getServiceAreaById = createAsyncThunk('serviceArea/getById', async (id, thunkAPI) => {
  try {
    return await AreaService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updateServiceArea = createAsyncThunk('serviceArea/update', async ({ id, data }, thunkAPI) => {
  try {
    return await AreaService.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deleteServiceArea = createAsyncThunk('serviceArea/delete', async (id, thunkAPI) => {
  try {
    return await AreaService.delete(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const toggleServiceAreaStatus = createAsyncThunk('serviceArea/toggleStatus', async (id, thunkAPI) => {
  try {
    return await AreaService.toggleStatus(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const searchServiceAreas = createAsyncThunk('serviceArea/search', async (region, thunkAPI) => {
  try {
    return await AreaService.search(region);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const bulkCreateServiceAreas = createAsyncThunk('serviceArea/bulkCreate', async (data, thunkAPI) => {
  try {
    return await AreaService.bulkCreate(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getPaginatedServiceAreas = createAsyncThunk('serviceArea/paginated', async (params, thunkAPI) => {
  try {
    return await AreaService.getPaginated(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Slice
const serviceAreaSlice = createSlice({
  name: 'Area',
  initialState,
  reducers: {
    resetServiceAreaState: (state) => {
      state.isAreaLoading = false;
      state.isAreaError = false;
      state.isAreaSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder

      // Create
      .addCase(createServiceArea.fulfilled, (state, action) => {
        state.isAreaSuccess = true;
        toast.success('Service area created');
      })
      .addCase(createServiceArea.rejected, (state, action) => {
        state.isAreaError = true;
        toast.error(action.payload);
      })

      // Get All
      .addCase(getAllServiceAreas.fulfilled, (state, action) => {
        state.areas = action.payload.areas;
        state.isAreaSuccess = true;
      })
      .addCase(getAllServiceAreas.rejected, (state, action) => {
        state.isAreaError = true;
        toast.error(action.payload);
      })

      // Get Active
      .addCase(getActiveServiceAreas.fulfilled, (state, action) => {
        state.areas = action.payload.areas;
        state.isAreaSuccess = true;
      })

      // Get by ID
      .addCase(getServiceAreaById.fulfilled, (state, action) => {
        state.area = action.payload.area;
        state.isAreaSuccess = true;
      })

      // Update
      .addCase(updateServiceArea.fulfilled, (state, action) => {
        state.area = action.payload.area;
        state.isAreaSuccess = true;
        toast.success('Updated successfully');
      })

      // Delete
      .addCase(deleteServiceArea.fulfilled, (state) => {
        state.isAreaSuccess = true;
        toast.success('Deleted successfully');
      })

      // Toggle
      .addCase(toggleServiceAreaStatus.fulfilled, (state) => {
        state.isAreaSuccess = true;
        toast.success('Status toggled');
      })

      // Search
      .addCase(searchServiceAreas.fulfilled, (state, action) => {
        state.areas = action.payload.areas;
        state.isAreaSuccess = true;
      })

      // Bulk Create
      .addCase(bulkCreateServiceAreas.fulfilled, (state) => {
        state.isAreaSuccess = true;
        toast.success('Bulk upload complete');
      })

      // Paginated
      .addCase(getPaginatedServiceAreas.fulfilled, (state, action) => {
        state.areas = action.payload.areas;
        state.total = action.payload.total;
        state.isAreaSuccess = true;
      })

      // All rejections
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isAreaError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetServiceAreaState } = serviceAreaSlice.actions;
export default serviceAreaSlice.reducer;
