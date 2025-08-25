import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

interface Zone {
  id: number;
  title_en: string;
  title_hi?: string;
  tags?: number[];
}

interface Pagination {
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

interface ZoneDetails {
  color_en?: string;
  color_hi?: string;
  element_en?: string;
  element_hi?: string;
  shape_en?: string;
  shape_hi?: string;
}

interface ZoneItem {
  name: string;
  meaning_en?: string | null;
  meaning_hi?: string | null;
}

interface ZoneState {
  zones: Zone[];
  loading: boolean;
  error: string | null;
  pagination?: Pagination;
  details?: ZoneDetails;
  items?: ZoneItem[];
}

const initialState: ZoneState = {
  zones: [],
  loading: false,
  error: null,
  pagination: {
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
  },
  details: undefined,
  items: undefined,
};

// Fetch zones by letter
export const fetchZonesDetails = createAsyncThunk<
  { zones: Zone[]; pagination: Pagination; details?: ZoneDetails; items?: ZoneItem[] },
  { letter?: string },
  { rejectValue: string }
>("zone/fetchZones", async ({ letter = "n" } = {}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/vastu/zones/${letter}/`, {
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json",
      },
    });
    console.log("Fetched zones Details:", response.data);

    const data = response.data.data || {};
    const zones: Zone[] = data.results || [];
    const pagination: Pagination = {
      totalPages: data?.pagination?.total_pages ?? 1,
      totalCount: data?.pagination?.total_count ?? zones.length,
      currentPage: data?.pagination?.current_page ?? 1,
      pageSize: data?.pagination?.page_size ?? 20,
    };
    const details: ZoneDetails | undefined = data.details;
    const items: ZoneItem[] | undefined = data.items;

    return { zones, pagination, details, items };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch zones");
  }
});

// PATCH zone details and items
export const updateZoneDetails = createAsyncThunk<
  { details: ZoneDetails; items: ZoneItem[] },
  { letter: string; details: ZoneDetails; items: ZoneItem[]; token: string },
  { rejectValue: string }
>(
  "zone/updateZoneDetails",
  async ({ letter, details, items, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/vastu/zones/${letter}/`,
        { details, items },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data || {};
      return {
        details: data.details,
        items: data.items,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update zone details");
    }
  }
);

const zoneSlice = createSlice({
  name: "zone",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchZonesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZonesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload.zones;
        state.pagination = action.payload.pagination;
        state.details = action.payload.details;
        state.items = action.payload.items;
      })
      .addCase(fetchZonesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateZoneDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateZoneDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload.details;
        state.items = action.payload.items;
      })
      .addCase(updateZoneDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default zoneSlice.reducer;
