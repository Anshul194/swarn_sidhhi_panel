import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosConfig';
interface Prediction {
  prediction_en: string | null;
  prediction_hi: string | null;
}

interface LifestylePredictions {
  lifestyle: string;
  predictions: {
    [key: string]: Prediction;
  };
}

interface PersonalYearState {
  data: LifestylePredictions[];
  loading: boolean;
  error: string | null;
}

const initialState: PersonalYearState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchPersonalYear = createAsyncThunk(
  'personalYear/fetchPersonalYear',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        '/numerology/year/1/',
        {
          headers: {
            'Content-Type': 'text/plain',
           
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch data');
    }
  }
);

export const updatePersonalYear = createAsyncThunk(
  'personalYear/updatePersonalYear',
  async (editData: LifestylePredictions[], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        '/numerology/year/1/',
        editData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update data');
    }
  }
);

const personalYearSlice = createSlice({
  name: 'personalYear',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalYear.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPersonalYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePersonalYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePersonalYear.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updatePersonalYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default personalYearSlice.reducer;
