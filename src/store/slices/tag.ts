import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// Tag type
interface Tag {
  id?: number;
  name: string;
}

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  selectedTag?: Tag | null;
}

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
  selectedTag: null,
};

export const fetchTags = createAsyncThunk<
  { rajyogs: Rajyog[]; pagination: Pagination },
  { page?: number; limit?: number; searchInput?: string },
  { rejectValue: string }
>(
  "tags/fetchAll",
  async ({ page = 1, limit = 20, searchInput } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", limit.toString());
      if (searchInput) params.append("search", searchInput);

      const res = await axiosInstance.get(
        `/content/tags/?${params.toString()}`
      );
      const data = res.data;
      const tags = data?.results || [];
      console.log("Fetched tags:=============>", tags);
      console.log("Pagination data:", data);
      const pagination: Pagination = {
        totalPages: Math.ceil(data?.count / limit) ?? 1,
        totalCount: data?.count ?? tags.length,
        currentPage: data?.current_page ?? page,
        pageSize: data?.page_size ?? limit,
      };

      return { tags, pagination };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch tags");
    }
  }
);

export const createTag = createAsyncThunk<
  Tag,
  { name: string },
  { rejectValue: string }
>("tags/create", async (tagData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`/content/tags/`, tagData);
    return res.data.data;
  } catch (err: any) {
    console.log("Error creating tag:", err);
    return rejectWithValue(err.message || "Failed to create tag");
  }
});

export const updateTag = createAsyncThunk<
  Tag,
  { id: number; data: Partial<Tag> },
  { rejectValue: string }
>("tags/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/content/tags/${id}/`, data);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update tag");
  }
});

export const deleteTag = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("tags/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/content/tags/${id}/`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete tag");
  }
});

// Slice

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clearSelectedTag(state) {
      state.selectedTag = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.tags;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching tags";
      })

      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
        state.loading = false;
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create tag";
      })

      .addCase(updateTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tags[index] = action.payload;
        state.selectedTag = action.payload;
      })

      .addCase(deleteTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter((tag) => tag.id !== action.payload);
      });
  },
});

export const { clearSelectedTag } = tagSlice.actions;
export default tagSlice.reducer;
