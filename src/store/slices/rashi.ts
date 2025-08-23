import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../services/axiosConfig';

export interface RashiDetails {
  short_description_en: string;
  short_description_hi: string;
  description_en: string;
  description_hi: string;
}

export interface RashiHouseDetails {
  name: string;
  description_en: string;
  description_hi: string;
}

export interface RashiData {
  details: RashiDetails;
  houses: RashiHouseDetails[];
}

export interface RashiState {
  data: RashiData | null;
  loading: boolean;
  error: string | null;
}

const initialState: RashiState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchRashiDetails = createAsyncThunk(
  "rashi/fetchDetails",
  async (
    { name }: { name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/kundli/rashis/${name}/`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch rashi details");
    }
  }
);

const rashiSlice = createSlice({
  name: "rashi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRashiDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRashiDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRashiDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default rashiSlice.reducer;
