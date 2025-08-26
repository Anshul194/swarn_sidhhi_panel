import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../services/axiosConfig';

export interface Personality {
  positive_en: string;
  positive_hi: string;
  negative_en: string;
  negative_hi: string;
}

export interface Remedy {
  missing_meaning_in_loshu_en: string;
  missing_meaning_in_loshu_hi: string;
}

export interface NumerologyNumberData {
  personality: Personality;
  remedy: Remedy;
  products: any[];
}

export interface NumerologyNumberState {
  data: NumerologyNumberData | null;
  loading: boolean;
  error: string | null;
}

const initialState: NumerologyNumberState = {
  data: null,
  loading: false,
  error: null,
};

// Thunk to fetch numerology number by ID
export const fetchNumerologyNumberById = createAsyncThunk(
  "numerologyNumbers/fetchById",
  async (
    { id }: { id: string | number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/numerology/numbers/${id}/`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch numerology number");
    }
  }
);

// Thunk to update numerology number by ID
export const updateNumerologyNumberById = createAsyncThunk(
  "numerologyNumbers/updateById",
  async (
    { id, payload }: { id: string | number; payload: Partial<NumerologyNumberData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/numerology/numbers/${id}/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            // You may want to get token from state or context
            // 'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update numerology number");
    }
  }
);

const numerologyNumbersSlice = createSlice({
  name: "numerologyNumbers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNumerologyNumberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNumerologyNumberById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNumerologyNumberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateNumerologyNumberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNumerologyNumberById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateNumerologyNumberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default numerologyNumbersSlice.reducer;
