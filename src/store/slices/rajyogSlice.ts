import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// Types
export interface Rajyog {
  id?: number;
  yog: string;
  title: string;
  title_en: string;
  title_hi: string;
  present_description: string;
  present_description_en: string;
  present_description_hi: string;
  missing_description: string;
  missing_description_en: string;
  missing_description_hi: string;
  is_rajyog: boolean;
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface RajyogState {
  rajyogs: Rajyog[];
  loading: boolean;
  error: string | null;
  selectedRajyog?: Rajyog | null;
  pagination?: Pagination;
}

const initialState: RajyogState = {
  rajyogs: [],
  loading: false,
  error: null,
  selectedRajyog: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
};

// Async Thunks
export const fetchRajyogs = createAsyncThunk<
  { rajyogs: Rajyog[]; pagination: Pagination },
  { page?: number; limit?: number; searchInput?: string },
  { rejectValue: string }
>(
  "rajyog/fetchAll",
  async ({ page = 1, limit = 20, searchInput } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", limit.toString());
      if (searchInput) params.append("search", searchInput);

      const res = await axiosInstance.get(
        `/content/numerology/loshu-rajyogs/?${params.toString()}`
      );
      const data = res.data.data;
      const rajyogs = data?.results || [];

      const pagination: Pagination = {
        totalPages: data?.pagination?.total_pages ?? 1,
        totalCount: data?.pagination?.count ?? rajyogs.length,
        currentPage: data?.pagination?.current_page ?? page,
        pageSize: data?.pagination?.page_size ?? limit,
      };

      return { rajyogs, pagination };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch rajyogs");
    }
  }
);

export const fetchRajyogById = createAsyncThunk<
  Rajyog,
  number,
  { rejectValue: string }
>("rajyog/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `/content/numerology/loshu-rajyogs/${id}/`
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch rajyog by ID");
  }
});

export const createRajyog = createAsyncThunk<
  Rajyog,
  Partial<Rajyog>,
  { rejectValue: string }
>("rajyog/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(
      `/content/numerology/loshu-rajyogs/`,
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create rajyog");
  }
});

export const updateRajyog = createAsyncThunk<
  Rajyog,
  { id: number; data: Partial<Rajyog> },
  { rejectValue: string }
>("rajyog/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(
      `/content/numerology/loshu-rajyogs/${id}/`,
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update rajyog");
  }
});

export const deleteRajyog = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("rajyog/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/content/numerology/loshu-rajyogs/${id}/`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete rajyog");
  }
});

// Slice
const rajyogSlice = createSlice({
  name: "rajyog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRajyogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRajyogs.fulfilled, (state, action) => {
        state.loading = false;
        state.rajyogs = action.payload.rajyogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRajyogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching rajyogs";
      })

      .addCase(fetchRajyogById.fulfilled, (state, action) => {
        state.selectedRajyog = action.payload;
      })

      .addCase(createRajyog.fulfilled, (state, action) => {
        state.rajyogs.push(action.payload);
      })

      .addCase(updateRajyog.fulfilled, (state, action) => {
        const index = state.rajyogs.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) state.rajyogs[index] = action.payload;
        state.selectedRajyog = action.payload;
      })

      .addCase(deleteRajyog.fulfilled, (state, action) => {
        state.rajyogs = state.rajyogs.filter((r) => r.id !== action.payload);
      });
  },
});

export default rajyogSlice.reducer;
