import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../services/axiosConfig";

interface Rashi {
  id: number;
  name: string;
  // Add other fields as per API response
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface RashiState {
  rashis: Rashi[];
  loading: boolean;
  error: string | null;
  selectedRashi?: Rashi | null;
  pagination?: Pagination;
}

const initialState: RashiState = {
  rashis: [],
  loading: false,
  error: null,
  selectedRashi: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
};

export const fetchRashis = createAsyncThunk<
  { rashis: Rashi[]; pagination: Pagination },
  { page?: number; pageSize?: number },
  { rejectValue: string }
>(
  "rashi/fetchRashis",
  async ({ page = 1, limit = 20, searchInput } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", limit.toString());
      if (searchInput) params.append("search", searchInput);

      const response = await axiosInstance.get(
        `/content/kundli/rashis?${params.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = response.data.data;
      console.log("Fetched Rashis:", data);
      const rashis = data?.results || [];
      const pagination: Pagination = {
        totalPages: data?.pagination?.total_pages ?? 1,
        totalCount: data?.pagination?.total_count ?? rashis.length,
        currentPage: data?.pagination?.current_page ?? page,
        pageSize: data?.pagination?.page_size ?? pageSize,
      };
      return { rashis, pagination };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch rashis");
    }
  }
);

export const fetchRashiById = createAsyncThunk<
  Rashi,
  number,
  { rejectValue: string }
>("rashi/fetchRashiById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/content/kundli/rashis/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("data ===> ", response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch rashi by id");
  }
});

export const createRashi = createAsyncThunk<
  Rashi,
  Partial<Rashi> & {
    short_description?: string;
    short_description_en?: string;
    short_description_hi?: string;
    description?: string;
    description_en?: string;
    description_hi?: string;
  },
  { rejectValue: string }
>("rashi/createRashi", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/content/kundli/rashis/", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data.data as Rashi;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to create rashi");
  }
});

export const updateRashi = createAsyncThunk<
  Rashi,
  { id: number; data: Partial<Rashi> },
  { rejectValue: string }
>("rashi/updateRashi", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/kundli/rashis/${id}/`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data.data as Rashi;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update rashi");
  }
});

export const deleteRashi = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("rashi/deleteRashi", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/content/kundli/rashis/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete rashi");
  }
});

const rashiSlice = createSlice({
  name: "rashi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRashis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRashis.fulfilled, (state, action) => {
        state.loading = false;
        state.rashis = action.payload.rashis;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRashis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRashiById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRashiById.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Fetched Rashi by ID:", action.payload);
        state.selectedRashi = action.payload;
        // const index = state.rashis.findIndex((r) => r.id === action.payload.id);
        // if (index !== -1) {
        //   state.rashis[index] = action.payload;
        // } else {
        //   state.rashis.push(action.payload);
        // }
      })
      .addCase(fetchRashiById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRashi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRashi.fulfilled, (state, action) => {
        state.loading = false;
        state.rashis.push(action.payload);
      })
      .addCase(createRashi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateRashi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRashi.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRashi = action.payload;
        const index = state.rashis.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.rashis[index] = action.payload;
        }
      })
      .addCase(updateRashi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteRashi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRashi.fulfilled, (state, action) => {
        state.loading = false;
        state.rashis = state.rashis.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRashi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default rashiSlice.reducer;
