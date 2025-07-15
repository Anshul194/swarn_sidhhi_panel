import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosConfig';

interface SupportTicket {
    userId: any;
    _id: string;
    subject: string;
    category: string;
    description: string;
    priority: string;
    status: string;
    attachments: string[];
    createdAt: string;
    updatedAt: string;
}

interface PaginationData {
    tickets: SupportTicket[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface SupportState {
    tickets: SupportTicket[];
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const initialState: SupportState = {
    tickets: [],
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },
};

// Async thunk to fetch support tickets
export const fetchSupportTickets = createAsyncThunk<
    PaginationData,
    { page?: number; limit?: number } | undefined
>('support/fetchSupportTickets', async (params = {}, { rejectWithValue }) => {
    try {
        const { page = 1, limit = 10 } = params;
        const response = await axiosInstance.get('/support-tickets/', {
            params: { page, limit },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const data = response.data?.data;
        return {
            tickets: data?.tickets || [],
            total: data?.total || 0,
            page: data?.page || 1,
            limit: data?.limit || 10,
            totalPages: data?.totalPages || 0,
        };
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch tickets');
    }
});

export const fetchSupportTicketById = createAsyncThunk<
    SupportTicket,
    string,
    { rejectValue: string }
>('support/fetchSupportTicketById', async (ticketId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/support-tickets/${ticketId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data?.data?.ticket;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch ticket');
    }
});

export const updateSupportTicketStatus = createAsyncThunk<
    SupportTicket,
    { ticketId: string; status: string },
    { rejectValue: string }
>(
    'support/updateSupportTicketStatus',
    async ({ ticketId, status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `/support-tickets/${ticketId}/status`,
                { status },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data?.data?.ticket;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update ticket status');
        }
    }
);

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSupportTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSupportTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload.tickets;
                state.pagination = {
                    total: action.payload.total,
                    page: action.payload.page,
                    limit: action.payload.limit,
                    totalPages: action.payload.totalPages,
                };
            })
            .addCase(fetchSupportTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchSupportTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSupportTicketById.fulfilled, (state, action) => {
                state.loading = false;
                const ticketIndex = state.tickets.findIndex(ticket => ticket._id === action.payload._id);
                if (ticketIndex !== -1) {
                    state.tickets[ticketIndex] = action.payload;
                } else {
                    state.tickets.push(action.payload);
                }
            })
            .addCase(fetchSupportTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateSupportTicketStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSupportTicketStatus.fulfilled, (state, action) => {
                state.loading = false;
                const ticketIndex = state.tickets.findIndex(ticket => ticket._id === action.payload._id);
                if (ticketIndex !== -1) {
                    state.tickets[ticketIndex] = action.payload;
                }
            })
            .addCase(updateSupportTicketStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default supportSlice.reducer;