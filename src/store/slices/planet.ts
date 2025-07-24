// src/features/planet/planetSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../services/axiosConfig';

interface PlanetPayload {
  name: string;
  description: string;
  description_en: string;
  description_hi: string;
}

interface PlanetState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: PlanetState = {
  loading: false,
  success: false,
  error: null,
};

// Async thunk
export const createPlanet = createAsyncThunk(
  'planet/create',
  async (planet: PlanetPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/content/kundli/planets/`,
        planet,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create planet');
    }
  }
);

const planetSlice = createSlice({
  name: 'planet',
  initialState,
  reducers: {
    resetPlanetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPlanet.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createPlanet.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createPlanet.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlanetState } = planetSlice.actions;

export default planetSlice.reducer;
