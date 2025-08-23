import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// Fetch house details by ID
export const fetchHouseById = createAsyncThunk(
  "house/fetchById",
  async ({ id }: { id: string | number }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `https://test.swarnsiddhi.com/admin/api/v1/kundli/houses/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // response.data.data contains details and planets
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface HouseDetails {
  details: {
    description_en: string;
    description_hi: string;
  };
  planets: Array<{
    name: string;
    pros_en: string | null;
    pros_hi: string | null;
    cons_en: string | null;
    cons_hi: string | null;
  }>;
}

interface HouseState {
  details: HouseDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: HouseState = {
  details: null,
  loading: false,
  error: null,
};

const houseSlice = createSlice({
  name: "house",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHouseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHouseById.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchHouseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default houseSlice.reducer;
