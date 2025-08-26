// ...existing code...

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosConfig';

interface Product {
  // Define product fields as per API response
  id?: number;
  name?: string;
  // Add more fields if needed
}

interface ProductsState {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  results: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    params: { limit?: number; offset?: number } = { limit: 50, offset: 0 },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/products/?limit=${params.limit ?? 50}&offset=${params.offset ?? 0}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/products/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${id}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product detail');
    }
  }
);


export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, payload }: { id: number | string; payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/products/${id}/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProductDetail = createAsyncThunk(
  'products/updateProductDetail',
  async ({ id, payload }: { id: number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/products/${id}/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product detail');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, add the new product to results
        // state.results.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        // Handle product detail data, maybe store in a separate state slice
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        // Handle updated product detail, maybe update in the results array
      })
      .addCase(updateProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
