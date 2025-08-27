import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../services/axiosConfig';


export interface RashiDetails {
  meaning_en?: string;
  meaning_hi?: string;
  remedy_en?: string;
  remedy_hi?: string;
  short_description_en?: string;
  short_description_hi?: string;
  description_en?: string;
  description_hi?: string;
}


export interface RashiHouseDetails {
  name: string;
  description_en?: string;
  description_hi?: string;
  pros_en?: string;
  pros_hi?: string;
  cons_en?: string;
  cons_hi?: string;
}


export interface RashiData {
  details: RashiDetails;
  houses: RashiHouseDetails[];
}


export interface RashiState {
  data: RashiData | null;
  loading: boolean;
  error: string | null;
  updateLoading?: boolean;
  updateError?: string | null;
  updateSuccess?: boolean;
}


const initialState: RashiState = {
  data: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
};
// PATCH rashi details
export const updateRashiDetails = createAsyncThunk(
  "rashi/updateDetails",
  async (
    { name, payload }: { name: string; payload: Partial<RashiData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/kundli/rashis/${name}/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'response' in error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return rejectWithValue((error as any).response?.data?.message || "Failed to update rashi details");
        }
        return rejectWithValue("Failed to update rashi details");
    }
  }
);

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
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'response' in error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return rejectWithValue((error as any).response?.data?.message || "Failed to fetch rashi details");
        }
        return rejectWithValue("Failed to fetch rashi details");
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
      })
      // Update Rashi Details
      .addCase(updateRashiDetails.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateRashiDetails.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.data = action.payload;
      })
      .addCase(updateRashiDetails.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export default rashiSlice.reducer;
