import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../services/axiosConfig';

interface AnalyticsState {
    data: any;
    loading: boolean;
    error: string | null;
}

const initialState: AnalyticsState = {
    data: null,
    loading: false,
    error: null,
};

// Async thunk to fetch analytics data
export const fetchAnalytics = createAsyncThunk(
    'analytics/fetchAnalytics',
    async (
        { baseUrl, token, period }: { baseUrl: string; token: string; period: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.get(
                `/users/analytics/?period=${period}`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default analyticsSlice.reducer;