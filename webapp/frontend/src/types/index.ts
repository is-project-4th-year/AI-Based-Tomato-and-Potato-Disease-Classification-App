// User types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  token: string;
}

// Disease types
export interface Disease {
  id: number;
  name: string;
  scientific_name?: string;
  plant_type: 'tomato' | 'potato';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  symptoms?: string;
  causes?: string;
  treatment?: string;
  prevention?: string;
  created_at: string;
  updated_at: string;
}

// Prediction types
export interface PredictionClass {
  class_name: string;
  confidence: number;
}

export interface Prediction {
  id: number;
  user_id: number;
  image_path: string;
  predicted_class: string;
  confidence: number;
  plant_type: 'tomato' | 'potato';
  disease_id?: number;
  disease?: Disease;
  all_predictions?: PredictionClass[];
  inference_time?: number;
  created_at: string;
  updated_at: string;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  data: User;
  token: string;
  message?: string;
}

export interface PredictionResponse {
  data: Prediction;
  message?: string;
}

export interface PredictionsListResponse {
  data: Prediction[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface DiseasesListResponse {
  data: Disease[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ML Service types
export interface MLHealthResponse {
  status: 'healthy' | 'unhealthy';
  model_loaded: boolean;
  version: string;
}

export interface MLModelInfoResponse {
  model_name: string;
  model_version: string;
  num_classes: number;
  classes: string[];
  input_shape: number[];
}

// Component prop types
export interface ImageUploadProps {
  onUploadSuccess?: (prediction: Prediction) => void;
  onUploadError?: (error: string) => void;
}

export interface PredictionCardProps {
  prediction: Prediction;
  onClick?: () => void;
}

export interface DiseaseInfoProps {
  disease: Disease;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Loading state types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Upload state types
export interface UploadState extends LoadingState {
  progress: number;
}
