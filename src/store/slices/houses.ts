import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// ----------------- Interfaces -----------------
interface Planet {
  name: string;
  pros_en?: string;
  pros_hi?: string;
  cons_en?: string;
  cons_hi?: string;
}

interface HouseDetails {
  description_en?: string;
  description_hi?: string;
}

export interface House {
  id: number;
  title_en: string;
  title_hi?: string;
  tags?: number[];
  details?: HouseDetails;
  planets?: Planet[];
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface HouseState {
  houses: House[];
  houseDetails?: House;
  loading: boolean;
  error: string | null;
  pagination?: Pagination;
}

// ----------------- Initial State -----------------
const initialState: HouseState = {
  houses: [],
  houseDetails: undefined,
  loading: false,
  error: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
};

// ----------------- Async Thunks -----------------



// Fetch a House by ID
export const fetchHouseById = createAsyncThunk<
  House,
  { id: number },
  { rejectValue: string }
>("houses/fetchById", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/kundli/houses/${id}/`, {
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json",
      },
    });
    // Return only the 'data' object from the response
    return response.data.data as House;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch house");
  }
});

// Update a House by ID
// Update a House by ID
export const updateHouseById = createAsyncThunk<
  House,
  { id: number; payload: Partial<House> },
  { rejectValue: string }
>("houses/updateById", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(`/kundli/houses/${id}/`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data as House;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update house");
  }
});


// ----------------- Slice -----------------
const houseSlice = createSlice({
  name: "houses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      // Fetch House Details
      .addCase(fetchHouseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHouseById.fulfilled, (state, action: PayloadAction<House>) => {
        state.loading = false;
        state.houseDetails = action.payload; // store the 'data' object directly
      })
      .addCase(fetchHouseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update House
      .addCase(updateHouseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHouseById.fulfilled, (state, action: PayloadAction<House>) => {
        state.loading = false;
        state.houseDetails = action.payload;
      })
      .addCase(updateHouseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default houseSlice.reducer;
