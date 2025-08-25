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

// Fetch analysis by MBTI type
export const fetchAnalysisByType = createAsyncThunk<
  Analysis[],
  { type: string; token: string },
  { rejectValue: string }
>("analysis/fetchByType", async ({ type, token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/karma-kundli/analysis/${type}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched analysis:", response.data?.data);
    return response.data?.data || [];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch analysis");
  }
});

// Update analysis by MBTI type
export const updateAnalysisByType = createAsyncThunk<
  Analysis[],
  { type: string; payload: Analysis[]; token: string },
  { rejectValue: string }
>("analysis/updateByType", async ({ type, payload, token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(`/karma-kundli/analysis/${type}/`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data || [];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to update analysis");
  }
});

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalysisByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisByType.fulfilled, (state, action: PayloadAction<Analysis[]>) => {
        state.loading = false;
        state.data = action.payload.map((item) => ({
          ...item,
          description_en: item.description_en || "",
          description_hi: item.description_hi || "",
        }));
      })
      .addCase(fetchAnalysisByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAnalysisByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnalysisByType.fulfilled, (state, action: PayloadAction<Analysis[]>) => {
        state.loading = false;
        state.data = action.payload.map((item) => ({
          ...item,
          description_en: item.description_en || "",
          description_hi: item.description_hi || "",
        }));
      })
      .addCase(updateAnalysisByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default analysisSlice.reducer;
