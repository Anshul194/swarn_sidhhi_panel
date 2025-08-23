
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../services/axiosConfig';

export interface PlanetDetails {
  meaning_en: string;
  meaning_hi: string;
  remedy_en: string;
  remedy_hi: string;
}

export interface HouseDetails {
  name: string;
  pros_en: string;
  pros_hi: string;
  cons_en: string;
  cons_hi: string;
}

export interface PlanetData {
  details: PlanetDetails;
  houses: HouseDetails[];
}

export interface PlanetState {
  data: PlanetData | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlanetState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchPlanetDetails = createAsyncThunk(
  "planet/fetchDetails",
  async (
    { name }: { name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/kundli/planets/${name}/`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch planet details");
    }
  }
);

export const updatePlanetDetails = createAsyncThunk(
  "planet/updateDetails",
  async (
    { name, details, houses }: { name: string; details: PlanetDetails; houses: HouseDetails[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/kundli/planets/${name}/`,
        { details, houses },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update planet details");
      }
      return rejectWithValue("Failed to update planet details");
    }
  }
);

const planetSlice = createSlice({
  name: "planet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanetDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanetDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPlanetDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(updatePlanetDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlanetDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updatePlanetDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default planetSlice.reducer;
