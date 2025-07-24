import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// Types
interface VastuEntrance {
  id: number;
  entry: string;
  meaning: string;
  meaning_en: string;
  meaning_hi: string;
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface VastuState {
  vastuEntrances: VastuEntrance[];
  loading: boolean;
  error: string | null;
  selectedEntrance?: VastuEntrance | null;
  pagination?: Pagination;
}

// Initial State
const initialState: VastuState = {
  vastuEntrances: [],
  loading: false,
  error: null,
  selectedEntrance: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
};

// Async Thunks
export const fetchEntrances = createAsyncThunk<
  { vastuEntrances: VastuEntrance[]; pagination: Pagination },
  { page?: number; limit?: number; searchInput?: string },
  { rejectValue: string }
>(
  "vastu/fetchEntrances",
  async ({ page = 1, limit = 20, searchInput } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", limit.toString());
      if (searchInput) params.append("search", searchInput);

      const res = await axiosInstance.get(
        `content/vastu/entrance/analysis/?${params.toString()}`
      );
      const data = res.data.data;
      const vastuEntrances = data?.results || [];
      const pagination: Pagination = {
        totalPages: data?.pagination?.total_pages ?? 1,
        totalCount: data?.pagination?.count ?? 0,
        currentPage: data?.pagination?.current_page ?? page,
        pageSize: data?.pagination?.page_size ?? limit,
      };
      return { vastuEntrances, pagination };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch entrances");
    }
  }
);

export const fetchEntranceById = createAsyncThunk<
  VastuEntrance,
  number,
  { rejectValue: string }
>("vastu/fetchEntranceById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `/content/vastu/entrance/analysis/${id}/`
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch entrance by id");
  }
});

export const createEntrance = createAsyncThunk<
  VastuEntrance,
  Partial<VastuEntrance>,
  { rejectValue: string }
>("vastu/createEntrance", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(
      "/content/vastu/entrance/analysis/",
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create entrance");
  }
});

export const updateEntrance = createAsyncThunk<
  VastuEntrance,
  { id: number; data: Partial<VastuEntrance> },
  { rejectValue: string }
>("vastu/updateEntrance", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.patch(
      `/content/vastu/entrance/analysis/${id}/`,
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update entrance");
  }
});

export const deleteEntrance = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("vastu/deleteEntrance", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/content/vastu/entrance/analysis/${id}/`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete entrance");
  }
});

// Slice
const vastuEntranceSlice = createSlice({
  name: "vastuEntrance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntrances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntrances.fulfilled, (state, action) => {
        state.loading = false;
        state.vastuEntrances = action.payload.vastuEntrances;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEntrances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      .addCase(fetchEntranceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntranceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEntrance = action.payload;
      })
      .addCase(fetchEntranceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      .addCase(createEntrance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEntrance.fulfilled, (state, action) => {
        state.loading = false;
        state.vastuEntrances.push(action.payload);
      })
      .addCase(createEntrance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      .addCase(updateEntrance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEntrance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vastuEntrances.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.vastuEntrances[index] = action.payload;
        }
        state.selectedEntrance = action.payload;
      })
      .addCase(updateEntrance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      .addCase(deleteEntrance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEntrance.fulfilled, (state, action) => {
        state.loading = false;
        state.vastuEntrances = state.vastuEntrances.filter(
          (e) => e.id !== action.payload
        );
      })
      .addCase(deleteEntrance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export default vastuEntranceSlice.reducer;
