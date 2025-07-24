import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// Types
interface EntranceChoice {
  id: number;
  choice: string;
  name: string;
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface EntranceChoiceState {
  entrances: EntranceChoice[];
  loading: boolean;
  error: string | null;
  selectedEntrance?: EntranceChoice | null;
  pagination?: Pagination;
}

const initialState: EntranceChoiceState = {
  entrances: [],
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
  { entrances: EntranceChoice[]; pagination: Pagination },
  { page?: number; limit?: number; searchInput?: string },
  { rejectValue: string }
>(
  "entranceChoice/fetchEntrances",
  async ({ page = 1, limit = 20, searchInput } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", limit.toString());
      if (searchInput) params.append("search", searchInput);

      const res = await axiosInstance.get(
        `/content/vastu/entrance/?${params.toString()}`
      );

      const data = res.data.data;
      console.log("Fetched entrances:", data);
      const entrances = data || [];
      const pagination: Pagination = {
        totalPages: data?.pagination?.total_pages ?? 1,
        totalCount: data?.pagination?.total_count ?? entrances.length,
        currentPage: data?.pagination?.current_page ?? page,
        pageSize: data?.pagination?.page_size ?? limit,
      };
      return { entrances, pagination };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch entrance choices");
    }
  }
);

export const fetchEntranceById = createAsyncThunk<
  EntranceChoice,
  number,
  { rejectValue: string }
>("entranceChoice/fetchEntranceById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `/content/vastu/entrance-choices/${id}`
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch entrance by id");
  }
});

export const createEntrance = createAsyncThunk<
  EntranceChoice,
  Partial<EntranceChoice>,
  { rejectValue: string }
>("entranceChoice/createEntrance", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(
      "/content/vastu/entrance-choices/",
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create entrance");
  }
});

export const updateEntrance = createAsyncThunk<
  EntranceChoice,
  { id: number; data: Partial<EntranceChoice> },
  { rejectValue: string }
>(
  "entranceChoice/updateEntrance",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/content/vastu/entrance-choices/${id}/`,
        data
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update entrance");
    }
  }
);

export const deleteEntrance = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("entranceChoice/deleteEntrance", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/content/vastu/entrance-choices/${id}/`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete entrance");
  }
});

// Slice
const entranceChoiceSlice = createSlice({
  name: "entranceChoice",
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
        state.entrances = action.payload.entrances;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEntrances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching entrance choices";
      })

      .addCase(fetchEntranceById.fulfilled, (state, action) => {
        state.selectedEntrance = action.payload;
      })

      .addCase(createEntrance.fulfilled, (state, action) => {
        state.entrances.push(action.payload);
      })

      .addCase(updateEntrance.fulfilled, (state, action) => {
        const index = state.entrances.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) state.entrances[index] = action.payload;
        state.selectedEntrance = action.payload;
      })

      .addCase(deleteEntrance.fulfilled, (state, action) => {
        state.entrances = state.entrances.filter(
          (e) => e.id !== action.payload
        );
      });
  },
});

export default entranceChoiceSlice.reducer;
