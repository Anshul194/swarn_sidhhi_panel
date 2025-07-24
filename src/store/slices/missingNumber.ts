import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// Types
interface MissingNumberRemedy {
  id?: number;
  missing_number: number;
  text: string;
  text_en: string;
  text_hi: string;
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface MissingNumberState {
  remedies: MissingNumberRemedy[];
  loading: boolean;
  error: string | null;
  selectedRemedy?: MissingNumberRemedy | null;
  pagination?: Pagination;
}

const initialState: MissingNumberState = {
  remedies: [],
  loading: false,
  error: null,
  selectedRemedy: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
};

// Async Thunks
export const fetchMissingNumberRemedies = createAsyncThunk<
  { remedies: MissingNumberRemedy[]; pagination: Pagination },
  { page?: number; limit?: number; searchInput?: string },
  { rejectValue: string }
>(
  "missingNumber/fetchAll",
  async ({ page = 1, limit = 20, searchInput } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", limit.toString());
      if (searchInput) params.append("search", searchInput);

      const res = await axiosInstance.get(
        `/content/numerology/missing-number-remedies/?${params.toString()}`
      );
      const data = res.data.data;
      const remedies = data?.results || [];

      const pagination: Pagination = {
        totalPages: data?.pagination?.total_pages ?? 1,
        totalCount: data?.pagination?.count ?? remedies.length,
        currentPage: data?.pagination?.current_page ?? page,
        pageSize: data?.pagination?.page_size ?? limit,
      };

      return { remedies, pagination };
    } catch (err: any) {
      return rejectWithValue(
        err.message || "Failed to fetch missing number remedies"
      );
    }
  }
);

export const fetchMissingNumberRemedyById = createAsyncThunk<
  MissingNumberRemedy,
  number,
  { rejectValue: string }
>("missingNumber/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `/content/numerology/missing-number-remedies/${id}/`
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch remedy by ID");
  }
});

export const createMissingNumberRemedy = createAsyncThunk<
  MissingNumberRemedy,
  Partial<MissingNumberRemedy>,
  { rejectValue: string }
>("missingNumber/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(
      `/content/numerology/missing-number-remedies/`,
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create remedy");
  }
});

export const updateMissingNumberRemedy = createAsyncThunk<
  MissingNumberRemedy,
  { id: number; data: Partial<MissingNumberRemedy> },
  { rejectValue: string }
>("missingNumber/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(
      `/content/numerology/missing-number-remedies/${id}/`,
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update remedy");
  }
});

export const deleteMissingNumberRemedy = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("missingNumber/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(
      `/content/numerology/missing-number-remedies/${id}/`
    );
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete remedy");
  }
});

// Slice
const missingNumberRemedySlice = createSlice({
  name: "missingNumberRemedy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissingNumberRemedies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissingNumberRemedies.fulfilled, (state, action) => {
        state.loading = false;
        state.remedies = action.payload.remedies;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMissingNumberRemedies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Error fetching missing number remedies";
      })

      .addCase(fetchMissingNumberRemedyById.fulfilled, (state, action) => {
        state.selectedRemedy = action.payload;
      })

      .addCase(createMissingNumberRemedy.fulfilled, (state, action) => {
        state.remedies.push(action.payload);
      })

      .addCase(updateMissingNumberRemedy.fulfilled, (state, action) => {
        const index = state.remedies.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) state.remedies[index] = action.payload;
        state.selectedRemedy = action.payload;
      })

      .addCase(deleteMissingNumberRemedy.fulfilled, (state, action) => {
        state.remedies = state.remedies.filter((r) => r.id !== action.payload);
      });
  },
});

export default missingNumberRemedySlice.reducer;
