import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface Analysis {
  element: string;
  description_en: string;
  description_hi: string;
}

interface AnalysisState {
  data: Analysis[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  data: [],
  loading: false,
  error: null,
};

// --------------------------- Fetch Analysis --------------------------- //
export const fetchAnalysisByType = createAsyncThunk<
  Analysis[],
  { type: string; token: string },
  { rejectValue: string }
>("analysis/fetchByType", async ({ type, token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/karma-kundli/analysis/${type}/`, {
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      maxRedirects: 0,
    });

    return response.data?.data || [];
  } catch (error: any) {
    if (error.response?.status === 301) {
      return rejectWithValue(
        "The requested resource was moved. Please contact support."
      );
    }
    if (error.response?.status >= 400) {
      return rejectWithValue(
        error.response.data?.message || "Failed to fetch analysis"
      );
    }
    return rejectWithValue(error.message || "Failed to fetch analysis");
  }
});

// --------------------------- Update Analysis --------------------------- //
export const updateAnalysisByType = createAsyncThunk<
  Analysis[],
  { type: string; payload: Analysis[]; token: string },
  { rejectValue: string }
>(
  "analysis/updateByType",
  async ({ type, payload, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/karma-kundli/analysis/${type}/`, // ensure trailing slash
        { data: payload }, // wrap payload in 'data'
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update analysis");
    }
  }
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAnalysisByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisByType.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalysisByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateAnalysisByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAnalysisByType.fulfilled,
        (state, action: PayloadAction<Analysis[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(updateAnalysisByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default analysisSlice.reducer;
