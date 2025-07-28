// studentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

const API_BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://test.swarnsiddhi.com/admin/api/v1";

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
>(
  "users/fetchAll",
  async (params: FetchUsersParams = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page !== undefined)
        queryParams.append("page", String(params.page));
      if (params.page_size !== undefined)
        queryParams.append("page_size", String(params.page_size));
      if (params.search) queryParams.append("search", params.search);
      if (params.is_premium !== undefined)
        queryParams.append("is_premium", String(params.is_premium));
      if (params.is_active !== undefined)
        queryParams.append("is_active", String(params.is_active));
      if (params.is_blocked !== undefined)
        queryParams.append("is_blocked", String(params.is_blocked));
      if (params.created_after)
        queryParams.append("created_after", params.created_after);
      if (params.created_before)
        queryParams.append("created_before", params.created_before);
      if (params.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params.sort_order)
        queryParams.append("sort_order", params.sort_order);

      // Always pass all query params as required by the API
      const response = await axiosInstance.get(
        `/users/?${queryParams.toString()}`,
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
  }
);

export const fetchUserById = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("users/fetchById", async (user_id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/users/${user_id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    console.log("Fetch user by ID response:", response.data);
    return response.data || null;
  } catch (error: any) {
    console.error("Fetch user by ID error:", error);
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export interface BlockUserParams {
  user_id: string;
  is_blocked: boolean;
  reason?: string;
}

export const blockUser = createAsyncThunk<
  any,
  BlockUserParams,
  { rejectValue: string }
>("users/blockUser", async (params, { rejectWithValue }) => {
  try {
    const { user_id, ...blockData } = params;
    const response = await axiosInstance.post(
      `/users/${user_id}/block/`,
      blockData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data?.data || null;
  } catch (error: any) {
    console.error("Block user error:", error);
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export interface UpdateUserParams {
  user_id: string;
  name?: string;
  email?: string;
  phone_number?: string;
  country_code?: string;
  gender?: string;
  lifestyle?: string;
  date_of_birth?: string;
  time_of_birth?: string;
  place_of_birth?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  karma_type?: string;
  grade?: string;
  is_active?: boolean;
  is_blocked?: boolean;
  block_reason?: string;
}

export const updateUser = createAsyncThunk<
  any,
  UpdateUserParams,
  { rejectValue: string }
>("users/updateUser", async (params, { rejectWithValue }) => {
  try {
    const { user_id, ...updateData } = params;
    const response = await axiosInstance.put(`/users/${user_id}/`, updateData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data?.data || null;
  } catch (error: any) {
    console.error("Update user error:", error);
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
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user in the list if it exists
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        // Also update userDetails if it matches
        if (state.userDetails?.id === action.payload.id) {
          state.userDetails = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
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
