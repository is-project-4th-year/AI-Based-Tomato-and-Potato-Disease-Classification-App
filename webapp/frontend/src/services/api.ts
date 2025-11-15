import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  PredictionResponse,
  PredictionsListResponse,
  DiseasesListResponse,
  ApiError,
  User,
  Disease,
} from '../types';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;

    // If there are validation errors, return the first one
    if (apiError?.errors) {
      const firstErrorKey = Object.keys(apiError.errors)[0];
      return apiError.errors[firstErrorKey][0];
    }

    // Otherwise return the message
    return apiError?.message || error.message || 'An error occurred';
  }

  return 'An unexpected error occurred';
};

// Authentication endpoints
export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getUser(): Promise<User> {
    const response = await api.get<{ data: User }>('/auth/user');
    return response.data.data;
  },
};

// Prediction endpoints
export const predictionService = {
  async predict(imageFile: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post<PredictionResponse>('/predictions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for ML inference
    });
    return response.data;
  },

  async getPredictions(page: number = 1): Promise<PredictionsListResponse> {
    const response = await api.get<PredictionsListResponse>(`/predictions?page=${page}`);
    return response.data;
  },

  async getPrediction(id: number): Promise<PredictionResponse> {
    const response = await api.get<PredictionResponse>(`/predictions/${id}`);
    return response.data;
  },

  async deletePrediction(id: number): Promise<void> {
    await api.delete(`/predictions/${id}`);
  },
};

// Disease endpoints
export const diseaseService = {
  async getDiseases(plantType?: 'tomato' | 'potato'): Promise<DiseasesListResponse> {
    const params = plantType ? { plant_type: plantType } : {};
    const response = await api.get<DiseasesListResponse>('/diseases', { params });
    return response.data;
  },

  async getDisease(id: number): Promise<{ data: Disease }> {
    const response = await api.get<{ data: Disease }>(`/diseases/${id}`);
    return response.data;
  },
};

export default api;
