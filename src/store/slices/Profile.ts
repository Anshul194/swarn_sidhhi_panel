import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

interface Profile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string;
}

interface ProfileState {
  profile?: Profile;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: undefined,
  loading: false,
  error: null,
};

// Fetch profile by token
export const fetchProfile = createAsyncThunk<
  Profile,
  { token: string },
  { rejectValue: string }
>("profile/fetchProfile", async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `/auth/profile/`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Full profile response:", response.data);
    return response.data as Profile;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch profile");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
