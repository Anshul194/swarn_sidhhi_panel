import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

interface Yog {
  id: number;
  title_en: string;
  title_hi?: string;
  is_rajyog?: boolean;
  tags?: number[];
  present_meaning_en?: string;
  present_meaning_hi?: string;
  missing_meaning_en?: string;
  missing_meaning_hi?: string;
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface YogState {
  yogs: Yog[];
  yogDetails?: Yog;
  loading: boolean;
  error: string | null;
  pagination?: Pagination;
}

const initialState: YogState = {
  yogs: [],
  yogDetails: undefined,
  loading: false,
  error: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
};

// Fetch yogs list
export const fetchYogsList = createAsyncThunk<
  { yogs: Yog[]; pagination: Pagination },
  void,
  { rejectValue: string }
>("yog/fetchYogsList", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/numerology/yogs/`, {
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json",
      },
    });
    console.log("Yogs fetched ", response.data);

    const data = response.data.data || {};
    const yogs: Yog[] = data.results || [];
    const pagination: Pagination = {
      totalPages: data?.pagination?.total_pages ?? 1,
      totalCount: data?.pagination?.total_count ?? yogs.length,
      currentPage: data?.pagination?.current_page ?? 1,
      pageSize: data?.pagination?.page_size ?? 20,
    };
    return { yogs, pagination };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch yogs");
  }
});

// Fetch a Yog by ID
export const fetchYogById = createAsyncThunk<
  Yog,
  { id: number },
  { rejectValue: string }
>(
  "yog/fetchById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/numerology/yogs/${id}/`, {
        headers: {
          "Content-Type": "text/plain",
          Accept: "application/json",
        },
      });
      const data: Yog = response.data.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch yog");
    }
  }
);

// Update a Yog by ID (now accepts token)
export const updateYogById = createAsyncThunk<
  Yog,
  { id: number; payload: Partial<Yog>; token: string },
  { rejectValue: string }
>("yog/updateById", async ({ id, payload, token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(
      `/numerology/yogs/${id}/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data as Yog;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update yog");
  }
});

const yogSlice = createSlice({
  name: "yog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Yog List
      .addCase(fetchYogsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYogsList.fulfilled, (state, action) => {
        state.loading = false;
        state.yogs = action.payload.yogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchYogsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Yog Details
      .addCase(fetchYogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYogById.fulfilled, (state, action: PayloadAction<Yog>) => {
        state.loading = false;
        state.yogDetails = action.payload;
      })
      .addCase(fetchYogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Yog
      .addCase(updateYogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateYogById.fulfilled, (state, action: PayloadAction<Yog>) => {
        state.loading = false;
        state.yogDetails = action.payload;
      })
      .addCase(updateYogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default yogSlice.reducer;
