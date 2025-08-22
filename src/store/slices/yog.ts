import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch yog details by ID
export const fetchYogById = createAsyncThunk(
  "yog/fetchById",
  async ({ id, token }: { id: string | number; token: string }, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://test.swarnsiddhi.com/admin/api/v1/numerology/yogs/${id}`,
        {
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
