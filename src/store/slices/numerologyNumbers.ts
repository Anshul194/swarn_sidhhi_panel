import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface NumerologyNumberState {
  data: any;
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
    { id, token }: { id: string | number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `https://test.swarnsiddhi.com/admin/api/v1/numerology/numbers/${id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch numerology number");
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
      });
  },
});

export default numerologyNumbersSlice.reducer;
