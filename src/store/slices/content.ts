import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosConfig';
interface Article {
    id: number;
    title: string;
}

interface Pagination {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    pageSize: number;
}

interface ContentState {
    articles: Article[];
    loading: boolean;
    error: string | null;
    selectedArticle?: Article | null;
    pagination?: Pagination;
}
const initialState: ContentState = {
    articles: [],
    loading: false,
    error: null,
    selectedArticle: null,
    pagination: {
        totalPages: 1,
        totalCount: 0,
        currentPage: 1,
        pageSize: 20,
    },
};


export const fetchArticles = createAsyncThunk<
    { articles: Article[]; pagination: Pagination },
    {
        token: string;
        baseUrl: string;
        searchInput?: string;
        categoryFilter?: string;
        expertId?: string | number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        page?: number;
        pageSize?: number;
        limit?: number;
    },
    { rejectValue: string }
>(
    'content/fetchArticles',
    async (
        {
            token,
            baseUrl,
            searchInput = '',
            categoryFilter = '',
            expertId = '',
            sortBy = 'published_at',
            sortOrder = 'desc',
            page = 1,
            pageSize,
            limit,
        },
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('page_size', (pageSize ?? limit ?? 20).toString());
            if (searchInput) params.append('search', searchInput);
            if (categoryFilter) params.append('category', categoryFilter);
            if (expertId) params.append('expert_id', expertId.toString());
            if (sortBy) params.append('sort_by', sortBy);
            if (sortOrder) params.append('sort_order', sortOrder);

            const response = await axiosInstance.get(
                `/articles/?${params.toString()}`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
console.log("Fetched Articles56:", response.data);
            const data = response.data;
            console?.log("data article", data);
            const articles = data?.results || [];
            const pagination: Pagination = {
                totalPages: data?.pagination?.total_pages ?? 1,
                totalCount: data?.pagination?.total_count ?? articles.length,
                currentPage: data?.pagination?.current_page ?? page,
                pageSize: data?.pagination?.page_size ?? (pageSize ?? limit ?? 20),
            };

            return { articles, pagination };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch articles');
        }
    }
);


export const fetchArticleById = createAsyncThunk<
    Article,
    { token: string; baseUrl: string; articleId: number | string },
    { rejectValue: string }
>(
    'content/fetchArticleById',
    async ({ articleId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/articles/${articleId}/`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
            console.log("Fetched Article by ID:", response.data);
            return response?.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch article');
        }
    }
);

export const deleteArticle = createAsyncThunk<
    number,
    {
        token: string;
        baseUrl: string;
        articleId: number | string;
    },
    { rejectValue: string }
>(
    'content/deleteArticle',
    async ({ token, articleId }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(
                `/articles/${articleId}/`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return typeof articleId === 'string' ? parseInt(articleId, 10) : articleId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete article');
        }
    }
);

export const updateArticle = createAsyncThunk<
    Article,
    {
        token: string;
        baseUrl: string;
        articleId: number | string;
        formData: FormData;
    },
    { rejectValue: string }
>(
    'content/updateArticle',
    async ({ articleId, formData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/articles/${articleId}/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Accept: 'application/json',
                    },
                }
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update article');
        }
    }
);


export const createArticle = createAsyncThunk<
    Article,
    {
        token: string;
        baseUrl: string;
        formData: FormData;
    },
    { rejectValue: string }
>(
    'content/createArticle',
    async ({ token, formData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/articles/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Accept: 'application/json',
                    },
                }
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create article');
        }
    }
);

const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = action.payload.articles;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Unknown error';
            })
            .addCase(fetchArticleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticleById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedArticle = action.payload;
            })
            .addCase(fetchArticleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Unknown error';
            })
            .addCase(updateArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedArticle = action.payload;
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Unknown error';
            })
            .addCase(createArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.articles.push(action.payload);
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Unknown error';
            })
            .addCase(deleteArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = state.articles.filter(
                    (article) => article.id !== action.payload
                );
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Unknown error';
            });
    },
});

export default contentSlice.reducer;