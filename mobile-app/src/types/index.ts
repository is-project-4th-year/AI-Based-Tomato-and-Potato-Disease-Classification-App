/**
 * Type Definitions
 * Matches webapp types for consistency
 */

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
export type PlantType = 'tomato' | 'potato';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Disease {
  id: number;
  name: string;
  scientific_name?: string;
  plant_type: PlantType;
  severity: Severity;
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
  plant_type: PlantType;
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

// ML Service types (for offline inference)
export interface MLHealthResponse {
  status: 'healthy' | 'unhealthy';
  model_loaded: boolean;
  version: string;
}

export interface MLModelInfo {
  model_name: string;
  model_version: string;
  num_classes: number;
  classes: string[];
  input_shape: number[];
}

// Mobile-specific types
export interface LocalPrediction extends Omit<Prediction, 'id'> {
  id: string; // Use UUID for local predictions
  localImageUri: string;
  synced: boolean;
  syncedAt?: string;
}

export interface CameraPhoto {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
}

export interface ImagePickerResult {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
  fileName?: string;
  fileSize?: number;
}

// Navigation types
export type RootStackParamList = {
  // Auth Stack
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;

  // Main Stack
  MainTabs: undefined;
  Dashboard: undefined;
  Camera: undefined;
  History: undefined;
  Settings: undefined;

  // Detail Screens
  PredictionDetail: {predictionId: number | string};
  DiseaseInfo: {diseaseId: number};
  Profile: undefined;
  EditProfile: undefined;
};

export type BottomTabParamList = {
  DashboardTab: undefined;
  CameraTab: undefined;
  HistoryTab: undefined;
  SettingsTab: undefined;
};

// Redux State types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PredictionState {
  predictions: Prediction[];
  localPredictions: LocalPrediction[];
  currentPrediction: Prediction | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: string | null;
}

export interface MLState {
  modelLoaded: boolean;
  modelInfo: MLModelInfo | null;
  isLoadingModel: boolean;
  error: string | null;
}

export interface AppState {
  isOnline: boolean;
  theme: 'light' | 'dark';
  language: 'en';
}

export interface RootState {
  auth: AuthState;
  predictions: PredictionState;
  ml: MLState;
  app: AppState;
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

// Component prop types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface UploadState extends LoadingState {
  progress: number;
}

// Storage keys
export enum StorageKeys {
  AUTH_TOKEN = '@PlantDiseaseApp:auth_token',
  USER_DATA = '@PlantDiseaseApp:user_data',
  LOCAL_PREDICTIONS = '@PlantDiseaseApp:local_predictions',
  THEME = '@PlantDiseaseApp:theme',
  LANGUAGE = '@PlantDiseaseApp:language',
  BIOMETRIC_ENABLED = '@PlantDiseaseApp:biometric_enabled',
}

// Permission types
export type PermissionStatus = 'granted' | 'denied' | 'limited' | 'blocked' | 'unavailable';

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

// Offline sync types
export interface SyncQueueItem {
  id: string;
  type: 'prediction' | 'update' | 'delete';
  data: any;
  timestamp: string;
  retryCount: number;
}

export interface SyncState {
  queue: SyncQueueItem[];
  isSyncing: boolean;
  lastSyncAt?: string;
}

// Export all types
export type * from './navigation';
