import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// Types
interface YearPrediction {
  id: number;
  year_number: number;
  mulank_number: number;
  prediction: string;
  prediction_en: string;
  prediction_hi: string;
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface YearPredictionState {
  predictions: YearPrediction[];
  loading: boolean;
  error: string | null;
  selectedPrediction?: YearPrediction | null;
  pagination?: Pagination;
}

const initialState: YearPredictionState = {
  predictions: [],
  loading: false,
  error: null,
  selectedPrediction: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
};

// Async Thunks
export const fetchYearPredictions = createAsyncThunk<
  { predictions: YearPrediction[]; pagination: Pagination },
  { page?: number; limit?: number; searchInput?: string },
  { rejectValue: string }
>(
  "yearPrediction/fetchYearPredictions",
  async ({ page = 1, limit = 20, searchInput } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", limit.toString());
      if (searchInput) params.append("search", searchInput);

      const res = await axiosInstance.get(
        `/content/numerology/year-predictions/?${params.toString()}`
      );
      const data = res.data.data;
      const predictions = data?.results || [];
      const pagination: Pagination = {
        totalPages: data?.pagination?.total_pages ?? 1,
        totalCount: data?.pagination?.total_count ?? predictions.length,
        currentPage: data?.pagination?.current_page ?? page,
        pageSize: data?.pagination?.page_size ?? limit,
      };
      return { predictions, pagination };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch year predictions");
    }
  }
);

export const fetchYearPredictionById = createAsyncThunk<
  YearPrediction,
  number,
  { rejectValue: string }
>("yearPrediction/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `/content/numerology/year-predictions/${id}/`
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch prediction by ID");
  }
});

export const createYearPrediction = createAsyncThunk<
  YearPrediction,
  Partial<YearPrediction>,
  { rejectValue: string }
>("yearPrediction/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(
      `/content/numerology/year-predictions/`,
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create prediction");
  }
});

export const updateYearPrediction = createAsyncThunk<
  YearPrediction,
  { id: number; data: Partial<YearPrediction> },
  { rejectValue: string }
>("yearPrediction/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(
      `/content/numerology/year-predictions/${id}/`,
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update prediction");
  }
});

export const deleteYearPrediction = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("yearPrediction/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/content/numerology/year-predictions/${id}/`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete prediction");
  }
});

// Slice
const yearPredictionSlice = createSlice({
  name: "yearPrediction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchYearPredictions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYearPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = action.payload.predictions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchYearPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching year predictions";
      })

      .addCase(fetchYearPredictionById.fulfilled, (state, action) => {
        state.selectedPrediction = action.payload;
      })

      .addCase(createYearPrediction.fulfilled, (state, action) => {
        state.predictions.push(action.payload);
      })

      .addCase(updateYearPrediction.fulfilled, (state, action) => {
        const index = state.predictions.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) state.predictions[index] = action.payload;
        state.selectedPrediction = action.payload;
      })

      .addCase(deleteYearPrediction.fulfilled, (state, action) => {
        state.predictions = state.predictions.filter(
          (p) => p.id !== action.payload
        );
      });
  },
});

export default yearPredictionSlice.reducer;
