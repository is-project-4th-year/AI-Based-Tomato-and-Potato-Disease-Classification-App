/**
 * App Configuration
 * Central configuration for API endpoints, constants, and settings
 */

// API Configuration
export const API_CONFIG = {
  // Base URLs - Update these for production
  BASE_URL: __DEV__ ? 'http://localhost:8000' : 'https://api.plantdisease.app',
  API_URL: __DEV__ ? 'http://localhost:8000/api' : 'https://api.plantdisease.app/api',
  ML_SERVICE_URL: __DEV__ ? 'http://localhost:3000' : 'https://ml.plantdisease.app',
  STORAGE_URL: __DEV__ ? 'http://localhost:8000/storage' : 'https://api.plantdisease.app/storage',

  // API Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    ME: '/user',

    // Predictions
    PREDICTIONS: '/predictions',
    PREDICT: '/predictions',

    // Diseases
    DISEASES: '/diseases',

    // ML Service
    ML_HEALTH: '/health',
    ML_MODEL_INFO: '/model/info',
  },

  // Request Configuration
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// ML Model Configuration
export const ML_CONFIG = {
  MODEL_NAME: 'MobileNetV2_20251027_200458_final.tflite',
  MODEL_PATH: 'models/MobileNetV2_20251027_200458_final.tflite',
  INPUT_SIZE: 224,
  NUM_CLASSES: 13,
  CONFIDENCE_THRESHOLD: 0.5,
  TOP_K: 3, // Number of top predictions to show

  // Class names (must match model training)
  CLASSES: [
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy',
  ],
};

// Image Processing Configuration
export const IMAGE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  COMPRESSION_QUALITY: 0.8,
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png'],
  CAMERA_QUALITY: 0.9,
};

// Storage Configuration
export const STORAGE_CONFIG = {
  MAX_LOCAL_PREDICTIONS: 100, // Maximum number of predictions to keep locally
  CACHE_EXPIRY_DAYS: 30, // Days before cache expires
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'Plant Disease Detector',
  APP_VERSION: '1.0.0',
  MIN_APP_VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@plantdisease.app',
  PRIVACY_URL: 'https://plantdisease.app/privacy',
  TERMS_URL: 'https://plantdisease.app/terms',
};

// Feature Flags
export const FEATURES = {
  OFFLINE_MODE: true,
  BIOMETRIC_AUTH: true,
  PUSH_NOTIFICATIONS: false, // Coming soon
  EXPORT_REPORTS: true,
  DARK_MODE: false, // Phase 2
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Animation Configuration
export const ANIMATION_CONFIG = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SPRING: {
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
};

// Export default config
export default {
  API_CONFIG,
  ML_CONFIG,
  IMAGE_CONFIG,
  STORAGE_CONFIG,
  APP_CONFIG,
  FEATURES,
  VALIDATION,
  ANIMATION_CONFIG,
};
