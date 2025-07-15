// studentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://test.swarnsiddhi.com/admin/api/v1";

export interface FetchUsersParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_premium?: boolean;
  is_active?: boolean;
  is_blocked?: boolean;
  created_after?: string;
  created_before?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const fetchAllUsers = createAsyncThunk<
  { users: any[]; pagination: any },
  FetchUsersParams
>("users/fetchAll", async (params: FetchUsersParams = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", String(params.page));
    if (params.page_size) queryParams.append("page_size", String(params.page_size));
    if (params.search) queryParams.append("search", params.search);
    if (params.is_premium !== undefined) queryParams.append("is_premium", String(params.is_premium));
    if (params.is_active !== undefined) queryParams.append("is_active", String(params.is_active));
    if (params.is_blocked !== undefined) queryParams.append("is_blocked", String(params.is_blocked));
    if (params.created_after) queryParams.append("created_after", params.created_after);
    if (params.created_before) queryParams.append("created_before", params.created_before);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_order) queryParams.append("sort_order", params.sort_order);

    // Fix: Use relative URL since axiosInstance already has baseURL
    const response = await axiosInstance.get(
      `/users?${queryParams.toString()}`, // Remove API_BASE_URL from here
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data?.data;

    return {
      users: data?.users || [],
      pagination: data?.pagination || {},
    };
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Alternative approach if the above doesn't work
export const fetchAllUsersAlternative = createAsyncThunk<
  { users: any[]; pagination: any },
  FetchUsersParams
>("users/fetchAllAlt", async (params: FetchUsersParams = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", String(params.page));
    if (params.page_size) queryParams.append("page_size", String(params.page_size));
    if (params.search) queryParams.append("search", params.search);
    if (params.is_premium !== undefined) queryParams.append("is_premium", String(params.is_premium));
    if (params.is_active !== undefined) queryParams.append("is_active", String(params.is_active));
    if (params.is_blocked !== undefined) queryParams.append("is_blocked", String(params.is_blocked));
    if (params.created_after) queryParams.append("created_after", params.created_after);
    if (params.created_before) queryParams.append("created_before", params.created_before);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_order) queryParams.append("sort_order", params.sort_order);

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    const response = await axiosInstance.get(
      `/users?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = response.data?.data;

    return {
      users: data?.users || [],
      pagination: data?.pagination || {},
    };
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// User slice state and reducers (unchanged)
export interface UserState {
  users: any[];
  userDetails: any | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: Record<string, any>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: UserState = {
  users: [],
  userDetails: null,
  loading: false,
  error: null,
  searchQuery: "",
  filters: {},
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.page = 1;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.filters = {};
      state.pagination.page = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearUserDetails,
  setSearchQuery,
  setFilters,
  resetFilters,
  setCurrentPage,
} = userSlice.actions;

export default userSlice.reducer;

// Selector to get all users
export const getAllUsers = (state: { users: UserState }) => state.users;