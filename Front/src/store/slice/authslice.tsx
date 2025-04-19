import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';


interface User {
  id: number;
  userName: string;
  email: string;
  role: string;
  imageUrl?: string;
  contracts?: any[];
}

interface AuthState {
  user: User | null;
  users: User[];
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
    userName: string;
    email: string;
    password: string;
    role?: 'client' | 'agent' | 'superviseur';
    imageUrl?: string;
    CIN: string;
    adresse: string;
    numéroTéléphone: string;
}

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  users: [],
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/login', credentials);
      
      if (!response.data?.token || !response.data?.user) {
        return rejectWithValue('Invalid response from server');
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || 
        apiError.message || 
        'Login failed'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/register', credentials);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Registration failed'
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await api.get('/api/users/current', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ id, formData, token }: { 
    id: number, 
    formData: FormData, 
    token: string 
  }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/users/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (!response.data || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { user: updatedUser };
    } catch (error: any) {
      console.error('Update user error:', error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message ||
        'Failed to update profile'
      );
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'auth/getAllUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get('http://localhost:3000/api/users/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('Access denied. Not authorized.');
      }
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to fetch users'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.token = null;
        localStorage.removeItem('token');
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;