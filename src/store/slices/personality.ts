import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// Type definitions
interface Personality {
  id: number;
  mulank_number: number;
  positive_side: string;
  negative_side: string;
  positive_side_hi: string;
  negative_side_hi: string;
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface PersonalityState {
  personalities: Personality[];
  loading: boolean;
  error: string | null;
  selectedPersonality?: Personality | null;
  pagination?: Pagination;
}

const initialState: PersonalityState = {
  personalities: [],
  loading: false,
  error: null,
  selectedPersonality: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
};

// Async thunks
export const fetchPersonalities = createAsyncThunk<
  { personalities: Personality[]; pagination: Pagination },
  { page?: number; limit?: number; searchInput?: string },
  { rejectValue: string }
>(
  "personality/fetchPersonalities",
  async ({ page = 1, limit = 20, searchInput } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", limit.toString());
      if (searchInput) params.append("search", searchInput);

      const res = await axiosInstance.get(
        `/content/numerology/personality/?${params.toString()}`
      );
      const data = res.data.data;
      console.log("Fetched personalities data:", data);
      const personalities = data?.results || [];
      const pagination: Pagination = {
        totalPages: data?.pagination?.total_pages ?? 1,
        totalCount: data?.pagination?.count ?? personalities.length,
        currentPage: data?.pagination?.current_page ?? page,
        pageSize: data?.pagination?.page_size ?? limit,
      };
      console.log("Fetched personalities:", { personalities, pagination });

      return { personalities, pagination };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch personalities");
    }
  }
);

export const fetchPersonalityById = createAsyncThunk<
  Personality,
  number,
  { rejectValue: string }
>("personality/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `/content/numerology/personality/${id}/`
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch personality by id");
  }
});

export const createPersonality = createAsyncThunk<
  Personality,
  Partial<Personality>,
  { rejectValue: string }
>("personality/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(
      "/content/numerology/personality/",
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create personality");
  }
});

export const updatePersonality = createAsyncThunk<
  Personality,
  { id: number; data: Partial<Personality> },
  { rejectValue: string }
>("personality/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(
      `/content/numerology/personality/${id}/`,
      data
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update personality");
  }
});

export const deletePersonality = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("personality/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/content/numerology/personality/${id}/`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete personality");
  }
});

// Slice
const personalitySlice = createSlice({
  name: "personality",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalities.fulfilled, (state, action) => {
        state.loading = false;
        state.personalities = action.payload.personalities;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPersonalities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch personalities";
      })

      .addCase(fetchPersonalityById.fulfilled, (state, action) => {
        state.selectedPersonality = action.payload;
      })

      .addCase(createPersonality.fulfilled, (state, action) => {
        state.personalities.push(action.payload);
      })

      .addCase(updatePersonality.fulfilled, (state, action) => {
        const index = state.personalities.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) state.personalities[index] = action.payload;
        state.selectedPersonality = action.payload;
      })

      .addCase(deletePersonality.fulfilled, (state, action) => {
        state.personalities = state.personalities.filter(
          (p) => p.id !== action.payload
        );
      });
  },
});

export default personalitySlice.reducer;
