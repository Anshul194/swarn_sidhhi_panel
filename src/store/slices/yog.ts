import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

interface YogData {
  title_en: string | null;
  title_hi: string | null;
  present_meaning_en: string | null;
  present_meaning_hi: string | null;
  missing_meaning_en: string | null;
  missing_meaning_hi: string | null;
  is_rajyog: boolean;
}

interface YogState {
  data: YogData | null;
  loading: boolean;
  error: string | null;
}

const initialState: YogState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchYogById = createAsyncThunk(
  "yog/fetchById",
  async ({ id }: { id: string | number }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `https://test.swarnsiddhi.com/admin/api/v1/numerology/yogs/${id}`,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const yogSlice = createSlice({
  name: "yog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchYogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYogById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchYogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default yogSlice.reducer;
