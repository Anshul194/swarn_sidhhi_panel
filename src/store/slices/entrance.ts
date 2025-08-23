import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface EntranceAnalysis {
  id: string;
  title_en: string;
  title_hi?: string;
  meaning_en?: string;
  meaning_hi?: string;
  tags?: number[];
}

interface EntranceState {
  entrances: EntranceAnalysis[];
  entranceDetails?: EntranceAnalysis;
  loading: boolean;
  error: string | null;
}

const initialState: EntranceState = {
  entrances: [],
  entranceDetails: undefined,
  loading: false,
  error: null,
};

// Fetch Entrance by ID
export const fetchEntranceById = createAsyncThunk<
  EntranceAnalysis,
  { id: string; token: string },
  { rejectValue: string }
>("entrance/fetchEntranceById", async ({ id, token }, { rejectWithValue }) => {
  try {
    if (!id) throw new Error("Entrance ID is required");
    const response = await axiosInstance.get(`/vastu/entrances/${id.toLowerCase()}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch entrance");
  }
});

// Update Entrance by ID
export const updateEntranceById = createAsyncThunk<
  EntranceAnalysis,
  { id: string; payload: Partial<EntranceAnalysis>; token: string },
  { rejectValue: string }
>("entrance/updateEntranceById", async ({ id, payload, token }, { rejectWithValue }) => {
  try {
    if (!id) throw new Error("Entrance ID is required");
    const response = await axiosInstance.patch(`/vastu/entrances/${id.toLowerCase()}/`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to update entrance");
  }
});

const entranceSlice = createSlice({
  name: "entrance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntranceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntranceById.fulfilled, (state, action: PayloadAction<EntranceAnalysis>) => {
        state.loading = false;
        state.entranceDetails = action.payload;
      })
      .addCase(fetchEntranceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEntranceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEntranceById.fulfilled, (state, action: PayloadAction<EntranceAnalysis>) => {
        state.loading = false;
        state.entranceDetails = action.payload; // Update local state after success
      })
      .addCase(updateEntranceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default entranceSlice.reducer;
