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
const AreaSlice = createSlice({
  name: 'serviceArea',
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
      // CREATE
      .addCase(createServiceArea.fulfilled, (state, action) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        toast.success('Service area created');
      })

      // GET ALL
      .addCase(getAllServiceAreas.fulfilled, (state, action) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        state.areas = action.payload.areas;
      })

      // GET ACTIVE
      .addCase(getActiveServiceAreas.fulfilled, (state, action) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        state.areas = action.payload.areas;
      })

      // GET BY ID
      .addCase(getServiceAreaById.fulfilled, (state, action) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        state.area = action.payload.area;
      })

      // UPDATE
      .addCase(updateServiceArea.fulfilled, (state, action) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        state.area = action.payload.area;
        toast.success('Updated successfully');
      })

      // DELETE
      .addCase(deleteServiceArea.fulfilled, (state) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        toast.success('Deleted successfully');
      })

      // TOGGLE STATUS
      .addCase(toggleServiceAreaStatus.fulfilled, (state) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        toast.success('Status toggled');
      })

      // SEARCH
      .addCase(searchServiceAreas.fulfilled, (state, action) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        state.areas = action.payload.areas;
      })

      // BULK CREATE
      .addCase(bulkCreateServiceAreas.fulfilled, (state) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        toast.success('Bulk upload complete');
      })

      // PAGINATED
      .addCase(getPaginatedServiceAreas.fulfilled, (state, action) => {
        state.isAreaLoading = false;
        state.isAreaSuccess = true;
        state.areas = action.payload.areas;
        state.total = action.payload.total;
      })

      // Handle pending states globally for all serviceArea thunks
      .addMatcher(
        (action) => action.type.startsWith('serviceArea/') && action.type.endsWith('/pending'),
        (state) => {
          state.isAreaLoading = true;
          state.isAreaError = false;
          state.isAreaSuccess = false;
          state.message = '';
        }
      )

      // Handle rejected states globally for all serviceArea thunks
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isAreaLoading = false;
          state.isAreaError = true;
          state.isAreaSuccess = false;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetServiceAreaState } = AreaSlice.actions;
export default AreaSlice.reducer;
