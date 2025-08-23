import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../services/axiosConfig";

interface AnalysisItem {
  element: string;
  description_en: string | null;
  description_hi: string | null;
}

interface NewAnalyticsState {
  data: AnalysisItem[];
  loading: boolean;
  error: string | null;
}

const initialState: NewAnalyticsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchKarmaKundliAnalysis = createAsyncThunk(
  'newAnalytics/fetchKarmaKundliAnalysis',
  async ({ type }: { type: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/karma-kundli/analysis/${type}`,
        {
          headers: {
            Accept: 'application/json',
            
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch data');
    }
  }
);

const newAnalyticsSlice = createSlice({
  name: 'newAnalytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKarmaKundliAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKarmaKundliAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchKarmaKundliAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default newAnalyticsSlice.reducer;
