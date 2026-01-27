// src/features/team/teamSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import TeamService from './TeamService';

const initialState = {
  teamMembers: [],
  teamMember: null,
  isTeamLoading: false,
  isTeamSuccess: false,
  isTeamError: false,
  message: ''
};

// Helper function to extract error message from API response
const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

// Async Thunks for API calls
export const registerTeamMember = createAsyncThunk('team/register', async (data, thunkAPI) => {
  try {
    return await TeamService.register(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getAllTeamMembers = createAsyncThunk('team/getAll', async (_, thunkAPI) => {
  try {
    return await TeamService.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const getTeamMemberById = createAsyncThunk('team/getById', async (id, thunkAPI) => {
  try {
    return await TeamService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updateTeamMember = createAsyncThunk('team/update', async ({ id, data }, thunkAPI) => {
  try {
    return await TeamService.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updateTeamMemberPassword = createAsyncThunk('team/updatePassword', async ({ id, data }, thunkAPI) => {
  try {
    return await TeamService.updatePassword(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const deleteTeamMember = createAsyncThunk('team/delete', async (id, thunkAPI) => {
  try {
    return await TeamService.delete(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

// Redux Slice
const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    resetTeamState: (state) => {
      state.isTeamLoading = false;
      state.isTeamError = false;
      state.isTeamSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerTeamMember.fulfilled, (state) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('Team member registered successfully!');
      })

      // GET ALL
      .addCase(getAllTeamMembers.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        state.teamMembers = action.payload;
      })

      // GET BY ID
      .addCase(getTeamMemberById.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        state.teamMember = action.payload;
      })

      // UPDATE
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('Team member updated successfully!');
      })

      // UPDATE PASSWORD
      .addCase(updateTeamMemberPassword.fulfilled, (state) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('Password updated successfully!');
      })

      // DELETE
      .addCase(deleteTeamMember.fulfilled, (state) => {
        state.isTeamLoading = false;
        state.isTeamSuccess = true;
        toast.success('Team member deleted successfully!');
      })

      // Matchers to handle pending and rejected states globally
      .addMatcher(
        (action) => action.type.startsWith('team/') && action.type.endsWith('/pending'),
        (state) => {
          state.isTeamLoading = true;
          state.isTeamError = false;
          state.isTeamSuccess = false;
          state.message = '';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isTeamLoading = false;
          state.isTeamError = true;
          state.isTeamSuccess = false;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetTeamState } = teamSlice.actions;
export default teamSlice.reducer;
