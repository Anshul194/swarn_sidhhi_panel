import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface AdvancedAnalysis {
  symptoms_en: string;
  symptoms_hi: string;
  remedy_en: string;
  remedy_hi: string;
  articles?: number[];
}

export interface AdvancedQuestion {
  question_en: string;
  question_hi: string;
}

interface AdvanceState {
  analysis: AdvancedAnalysis | null;
  questions: AdvancedQuestion[];
  loading: boolean;
  error: string | null;
}

const initialState: AdvanceState = {
  analysis: null,
  questions: [],
  loading: false,
  error: null,
};

// Fetch advanced analysis by topic/planet
export const fetchAdvancedAnalysis = createAsyncThunk<
  AdvancedAnalysis,
  { topic: string; token: string },
  { rejectValue: string }
>("advance/fetchAnalysis", async ({ topic, token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `/karma-kundli/advanced-analysis/${topic}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data?.data?.analysis || {};
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch advanced analysis");
  }
});

// Update advanced analysis by topic/planet
export const updateAdvancedAnalysis = createAsyncThunk<
  AdvancedAnalysis,
  { topic: string; payload: AdvancedAnalysis; token: string },
  { rejectValue: string }
>("advance/updateAnalysis", async ({ topic, payload, token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(
      `/karma-kundli/advanced-analysis/${topic}/`,
      { analysis: payload },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data?.data?.analysis || {};
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to update advanced analysis");
  }
});

// Add advanced question for topic/planet
export const addAdvancedQuestion = createAsyncThunk<
  AdvancedQuestion,
  { topic: string; payload: AdvancedQuestion; token: string },
  { rejectValue: string }
>("advance/addQuestion", async ({ topic, payload, token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      `/karma-kundli/advanced-questions/${topic}/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data?.data || payload;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to add advanced question");
  }
});

// Fetch advanced questions for topic/planet
export const fetchAdvancedQuestions = createAsyncThunk<
  AdvancedQuestion[],
  { topic: string; token: string },
  { rejectValue: string }
>("advance/fetchQuestions", async ({ topic, token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `/karma-kundli/advanced-questions/${topic}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Support paginated response with 'results' array
    let questions: AdvancedQuestion[] = [];
    if (Array.isArray(response.data?.results)) {
      questions = response.data.results;
    } else if (Array.isArray(response.data?.data)) {
      questions = response.data.data;
    } else {
      questions = [];
    }
    console.log("Fetched advanced questions:", questions);
    return questions;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch advanced questions");
  }
});

const advanceSlice = createSlice({
  name: "advance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvancedAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvancedAnalysis.fulfilled, (state, action: PayloadAction<AdvancedAnalysis>) => {
        state.loading = false;
        state.analysis = action.payload;
      })
      .addCase(fetchAdvancedAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdvancedAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdvancedAnalysis.fulfilled, (state, action: PayloadAction<AdvancedAnalysis>) => {
        state.loading = false;
        state.analysis = action.payload;
      })
      .addCase(updateAdvancedAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAdvancedQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdvancedQuestion.fulfilled, (state, action: PayloadAction<AdvancedQuestion>) => {
        state.loading = false;
        state.questions = [...state.questions, action.payload];
      })
      .addCase(addAdvancedQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdvancedQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvancedQuestions.fulfilled, (state, action: PayloadAction<AdvancedQuestion[]>) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchAdvancedQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default advanceSlice.reducer;
