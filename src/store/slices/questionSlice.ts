import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

interface Question {
  id: number;
  question_en: string;
  question_hi?: string;
  type: string;
  // Add other fields if returned by API
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  selectedQuestion?: Question | null;
  pagination?: Pagination;
}

const initialState: QuestionState = {
  questions: [],
  loading: false,
  error: null,
  selectedQuestion: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
};

// Fetch all questions with optional pagination & search
export const fetchQuestions = createAsyncThunk<
  { questions: Question[]; pagination: Pagination },
  { page?: number; pageSize?: number; searchInput?: string },
  { rejectValue: string }
>(
  "question/fetchQuestions",
  async ({ page = 1, pageSize = 20, searchInput } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", pageSize.toString());
      if (searchInput) params.append("search", searchInput);

      const response = await axiosInstance.get(`/karma-kundli/questions/?${params.toString()}`, {
        headers: { Accept: "application/json" },
      });
      console.log("Fetched questions:", response.data);

      const data = response.data;
      const questions = data?.results || [];
      const pagination: Pagination = {
        totalPages: data?.pagination?.total_pages ?? 1,
        totalCount: data?.pagination?.total_count ?? questions.length,
        currentPage: data?.pagination?.current_page ?? page,
        pageSize: data?.pagination?.page_size ?? pageSize,
      };
      return { questions, pagination };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch questions");
    }
  }
);

// Fetch single question by ID
export const fetchQuestionById = createAsyncThunk<Question, number, { rejectValue: string }>(
  "question/fetchQuestionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/karma-kundli/questions/${id}/`, {
        headers: { Accept: "application/json" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch question");
    }
  }
);

// Create new question
export const createQuestion = createAsyncThunk<
  Question,
  Partial<Question>,
  { rejectValue: string }
>("question/createQuestion", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/karma-kundli/questions/`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to create question");
  }
});

// Update question
export const updateQuestion = createAsyncThunk<
  Question,
  { id: number; data: Partial<Question> },
  { rejectValue: string }
>("question/updateQuestion", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/karma-kundli/questions/${id}/`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update question");
  }
});

// Delete question
export const deleteQuestion = createAsyncThunk<number, number, { rejectValue: string }>(
  "question/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/karma-kundli/questions/${id}/`, {
        headers: { Accept: "application/json" },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete question");
    }
  }
);

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuestion = action.payload;
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuestion = action.payload;
        const index = state.questions.findIndex((q) => q.id === action.payload.id);
        if (index !== -1) state.questions[index] = action.payload;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter((q) => q.id !== action.payload);
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default questionSlice.reducer;
