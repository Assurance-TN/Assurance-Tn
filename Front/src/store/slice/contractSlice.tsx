import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Contract {
    id: number;
    type: string;
    description: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    duration: string;
    startDate: string;
    endDate: string;
    status: string;
    pdfUrl: string;
    signatureUrl: string;
    agentId: number;
    clientId: number;
}

interface ContractState {
    contracts: Contract[];
    currentContract: Contract | null;
    loading: boolean;
    error: string | null;
}

const initialState: ContractState = {
    contracts: [],
    currentContract: null,
    loading: false,
    error: null
};

// Create axios instance with auth token
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createContract = createAsyncThunk(
    'contract/create',
    async (contractData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/contracts/create', contractData);
            return response.data.contract;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create contract');
        }
    }
);

export const getAgentContracts = createAsyncThunk(
    'contract/getAgentContracts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/contracts/agent');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contracts');
        }
    }
);

export const getClientContracts = createAsyncThunk(
    'contract/getClientContracts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/contracts/client');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contracts');
        }
    }
);

export const signContract = createAsyncThunk(
    'contract/sign',
    async ({ contractId, signature }: { contractId: number, signature: File }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('signature', signature);
            const response = await api.post(`/contracts/${contractId}/sign`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.contract;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to sign contract');
        }
    }
);

export const getContractById = createAsyncThunk(
    'contract/getById',
    async (contractId: number, { rejectWithValue }) => {
        try {
            const response = await api.get(`/contracts/${contractId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contract');
        }
    }
);

export const getAvailableContracts = createAsyncThunk(
    'contract/getAvailableContracts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/contracts/available');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch available contracts');
        }
    }
);

const contractSlice = createSlice({
    name: 'contract',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentContract: (state) => {
            state.currentContract = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Contract
            .addCase(createContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createContract.fulfilled, (state, action) => {
                state.loading = false;
                state.contracts.push(action.payload);
            })
            .addCase(createContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get Agent Contracts
            .addCase(getAgentContracts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAgentContracts.fulfilled, (state, action) => {
                state.loading = false;
                state.contracts = action.payload;
            })
            .addCase(getAgentContracts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get Client Contracts
            .addCase(getClientContracts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClientContracts.fulfilled, (state, action) => {
                state.loading = false;
                state.contracts = action.payload;
            })
            .addCase(getClientContracts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Sign Contract
            .addCase(signContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signContract.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.contracts.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.contracts[index] = action.payload;
                }
                if (state.currentContract?.id === action.payload.id) {
                    state.currentContract = action.payload;
                }
            })
            .addCase(signContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get Contract by ID
            .addCase(getContractById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getContractById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentContract = action.payload;
            })
            .addCase(getContractById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get Available Contracts
            .addCase(getAvailableContracts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvailableContracts.fulfilled, (state, action) => {
                state.loading = false;
                state.contracts = action.payload;
            })
            .addCase(getAvailableContracts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, clearCurrentContract } = contractSlice.actions;
export default contractSlice.reducer; 