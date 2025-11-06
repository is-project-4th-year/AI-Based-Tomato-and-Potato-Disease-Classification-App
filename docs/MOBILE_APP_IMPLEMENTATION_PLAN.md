# Mobile Application Implementation Plan
## AI-Based Tomato and Potato Disease Classification

**Branch:** `RemoteDesk/mobile-app`
**Architecture:** React Native + TensorFlow Lite (On-Device) + Laravel Backend
**Platforms:** Android & iOS

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [System Components](#system-components)
4. [Project Structure](#project-structure)
5. [Implementation Phases](#implementation-phases)
6. [Detailed Task Breakdown](#detailed-task-breakdown)
7. [API Integration](#api-integration)
8. [Model Integration](#model-integration)
9. [Deployment Strategy](#deployment-strategy)
10. [Testing Strategy](#testing-strategy)

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    MOBILE DEVICE (Android/iOS)                   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         React Native Application                       │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────┐      │    │
│  │  │           Presentation Layer                │      │    │
│  │  │  • Authentication screens                   │      │    │
│  │  │  • Camera/Gallery integration               │      │    │
│  │  │  • Prediction display                       │      │    │
│  │  │  • Dashboard & history                      │      │    │
│  │  │  • Offline mode support                     │      │    │
│  │  └─────────────────────────────────────────────┘      │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────┐      │    │
│  │  │         Business Logic Layer                │      │    │
│  │  │  • State management (Redux/Zustand)         │      │    │
│  │  │  • API client                               │      │    │
│  │  │  • Local inference orchestration            │      │    │
│  │  │  • Offline queue management                 │      │    │
│  │  └─────────────────────────────────────────────┘      │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────┐      │    │
│  │  │         Data Layer                          │      │    │
│  │  │  • AsyncStorage (local storage)             │      │    │
│  │  │  • SQLite (local database - optional)       │      │    │
│  │  │  • Secure storage (tokens)                  │      │    │
│  │  └─────────────────────────────────────────────┘      │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────┐      │    │
│  │  │    TensorFlow Lite Inference Engine         │      │    │
│  │  │  • On-device model inference                │      │    │
│  │  │  • Image preprocessing                      │      │    │
│  │  │  • MobileNetV2 TFLite model (~25MB)        │      │    │
│  │  │  • Predictions post-processing              │      │    │
│  │  └─────────────────────────────────────────────┘      │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────┐      │    │
│  │  │         Native Modules                      │      │    │
│  │  │  • Camera (react-native-vision-camera)      │      │    │
│  │  │  • File system                              │      │    │
│  │  │  • Permissions                              │      │    │
│  │  └─────────────────────────────────────────────┘      │    │
│  └─────────────────────┬───────────────────────────────────┘    │
└────────────────────────┼───────────────────────────────────────┘
                         │ HTTPS (API Calls)
                         │ (When online)
┌────────────────────────▼───────────────────────────────────────┐
│          HOSTINGER SHARED HOSTING                              │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         Laravel 11 Backend (PHP 8.2+)                │    │
│  │                                                       │    │
│  │  • User authentication (Sanctum)                     │    │
│  │  • Prediction history sync                           │    │
│  │  • Cloud backup                                      │    │
│  │  • Disease information                               │    │
│  │  • Treatment recommendations                         │    │
│  │  • Analytics                                         │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │              MySQL Database                 │    │    │
│  │  │  • User accounts                            │    │    │
│  │  │  • Prediction history                       │    │    │
│  │  │  • Disease information                      │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

1. **On-Device Inference (Primary)**
   - Uses TensorFlow Lite for local predictions
   - Works offline
   - Fast inference (~200-500ms)
   - Privacy-friendly (images never leave device)
   - Reduced backend load

2. **Backend Integration (Secondary)**
   - User authentication
   - Cloud sync for prediction history
   - Treatment information retrieval
   - Analytics and insights
   - Cross-device synchronization

3. **Hybrid Approach**
   - Inference happens locally (TFLite)
   - Results sync to cloud when online
   - Offline-first architecture
   - Queue-based sync mechanism

---

## 🛠️ Technology Stack

### Mobile Application
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.73+ | Cross-platform mobile framework |
| TypeScript | 5.0+ | Type safety |
| React Navigation | 6.x | Navigation & routing |
| Redux Toolkit / Zustand | Latest | State management |
| React Query | 5.0+ | Server state & caching |
| Axios | 1.6+ | HTTP client |
| React Hook Form | 7.48+ | Form management |
| Zod | 3.22+ | Schema validation |

### UI Components & Styling
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native Paper | 5.x | Material Design components |
| React Native Vector Icons | 10.x | Icons |
| React Native Reanimated | 3.x | Animations |
| Styled Components / Tailwind RN | Latest | Styling |

### Camera & Media
| Technology | Version | Purpose |
|-----------|---------|---------|
| react-native-vision-camera | 3.x | Camera access |
| react-native-image-picker | Latest | Gallery access |
| react-native-image-crop-picker | Latest | Image cropping |
| react-native-fs | Latest | File system access |

### ML & AI
| Technology | Version | Purpose |
|-----------|---------|---------|
| @tensorflow/tfjs | 4.x | TensorFlow.js (fallback) |
| @tensorflow/tfjs-react-native | 0.8+ | TensorFlow.js for RN |
| react-native-tensorflow-lite | Latest | TFLite integration |

### Storage & Database
| Technology | Version | Purpose |
|-----------|---------|---------|
| @react-native-async-storage/async-storage | 1.21+ | Key-value storage |
| react-native-encrypted-storage | Latest | Secure storage (tokens) |
| react-native-sqlite-storage | 6.x | Local database (optional) |

### Native Modules
| Technology | Version | Purpose |
|-----------|---------|---------|
| react-native-permissions | 4.x | Permission handling |
| @react-native-community/netinfo | 11.x | Network status |
| react-native-device-info | 10.x | Device information |
| react-native-splash-screen | 3.x | Splash screen |

### Development Tools
| Technology | Purpose |
|-----------|---------|
| Expo (optional) | Simplified development |
| React Native CLI | Native development |
| Flipper | Debugging |
| Jest | Unit testing |
| Detox | E2E testing (optional) |

### Backend (Reuses Web App Backend)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Laravel | 11.x | Backend API |
| Laravel Sanctum | 4.x | API authentication |
| MySQL | 8.0 | Database |

---

## 🔧 System Components

### 1. Mobile Application (React Native)

**Location:** `/mobile-app/`

**Key Features:**

#### Core Features
1. **Authentication**
   - Login with email/password
   - Register new account
   - Biometric authentication (Face ID / Fingerprint)
   - Secure token storage
   - Auto-logout on token expiration

2. **Image Capture & Selection**
   - In-app camera with preview
   - Photo library access
   - Image cropping & rotation
   - Image quality validation
   - Multiple capture modes (auto/manual)

3. **On-Device Inference**
   - TensorFlow Lite model loading
   - Image preprocessing
   - Real-time prediction (~200-500ms)
   - Confidence scoring
   - Top-N predictions display

4. **Prediction Results**
   - Disease name & confidence
   - Detailed disease information
   - Treatment recommendations
   - Prevention tips
   - Save to history

5. **Offline Support**
   - Full offline inference
   - Local storage of predictions
   - Queue-based sync when online
   - Offline-first architecture
   - Background sync

6. **Dashboard & History**
   - Prediction history
   - Statistics (total, by disease)
   - Charts & analytics
   - Search & filter
   - Export history (CSV/PDF)

7. **Settings**
   - Profile management
   - App preferences (theme, language)
   - Model updates
   - Data sync settings
   - Clear cache

#### User Flow
```
1. Launch App
   ↓
2. Authentication (Login/Register)
   ↓
3. Main Dashboard
   ├─→ View Statistics
   ├─→ View History
   └─→ New Prediction
       ├─→ Take Photo (Camera)
       │   └─→ Review & Crop
       └─→ Choose from Gallery
           └─→ Review & Crop
              ↓
       4. On-Device Inference
          ↓
       5. Display Results
          ├─→ Disease Information
          ├─→ Treatment Recommendations
          ├─→ Save to History
          └─→ Share Results
              ↓
       6. Sync to Cloud (when online)
```

---

## 📁 Project Structure

```
mobile-app/
│
├── android/                       # Android native code
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── assets/
│   │   │       │   └── model/    # TFLite model
│   │   │       ├── java/
│   │   │       └── AndroidManifest.xml
│   │   └── build.gradle
│   └── build.gradle
│
├── ios/                           # iOS native code
│   ├── PlantDiseaseApp/
│   │   ├── AppDelegate.h
│   │   ├── AppDelegate.mm
│   │   ├── Info.plist
│   │   └── Assets.xcassets/
│   └── PlantDiseaseApp.xcodeproj/
│
├── src/
│   ├── assets/                    # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── model/
│   │       ├── model.tflite       # TFLite model
│   │       └── labels.json        # Class labels
│   │
│   ├── components/                # Reusable components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── BiometricPrompt.tsx
│   │   │
│   │   ├── camera/
│   │   │   ├── CameraView.tsx
│   │   │   ├── ImagePicker.tsx
│   │   │   ├── ImageCropper.tsx
│   │   │   └── ImagePreview.tsx
│   │   │
│   │   ├── prediction/
│   │   │   ├── PredictionResult.tsx
│   │   │   ├── DiseaseInfo.tsx
│   │   │   ├── TreatmentCard.tsx
│   │   │   ├── ConfidenceBar.tsx
│   │   │   └── PredictionCard.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RecentPredictions.tsx
│   │   │   ├── AnalyticsChart.tsx
│   │   │   └── QuickActions.tsx
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── TabBar.tsx
│   │       └── Screen.tsx
│   │
│   ├── screens/                   # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   │
│   │   ├── main/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── CameraScreen.tsx
│   │   │   ├── PredictionResultScreen.tsx
│   │   │   ├── HistoryScreen.tsx
│   │   │   ├── PredictionDetailScreen.tsx
│   │   │   └── DiseaseLibraryScreen.tsx
│   │   │
│   │   └── settings/
│   │       ├── SettingsScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       └── AboutScreen.tsx
│   │
│   ├── navigation/                # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── types.ts
│   │
│   ├── services/                  # Services & API
│   │   ├── api/
│   │   │   ├── client.ts          # Axios instance
│   │   │   ├── authService.ts
│   │   │   ├── predictionService.ts
│   │   │   └── syncService.ts
│   │   │
│   │   ├── ml/
│   │   │   ├── modelLoader.ts     # TFLite model loader
│   │   │   ├── preprocessor.ts    # Image preprocessing
│   │   │   ├── predictor.ts       # Inference logic
│   │   │   └── postprocessor.ts   # Result processing
│   │   │
│   │   ├── storage/
│   │   │   ├── asyncStorage.ts
│   │   │   ├── secureStorage.ts
│   │   │   └── database.ts        # SQLite (optional)
│   │   │
│   │   └── camera/
│   │       ├── cameraService.ts
│   │       └── imageService.ts
│   │
│   ├── store/                     # State management
│   │   ├── index.ts               # Store configuration
│   │   ├── slices/                # Redux slices (if Redux)
│   │   │   ├── authSlice.ts
│   │   │   ├── predictionSlice.ts
│   │   │   ├── historySlice.ts
│   │   │   └── settingsSlice.ts
│   │   └── hooks.ts               # Typed hooks
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCamera.ts
│   │   ├── usePrediction.ts
│   │   ├── useOfflineSync.ts
│   │   └── useNetworkStatus.ts
│   │
│   ├── types/                     # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── prediction.types.ts
│   │   ├── navigation.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   ├── permissions.ts
│   │   └── logger.ts
│   │
│   ├── theme/                     # Theme configuration
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   └── App.tsx                    # Root component
│
├── __tests__/                     # Tests
│   ├── components/
│   ├── screens/
│   ├── services/
│   └── utils/
│
├── .env.example                   # Environment variables template
├── .eslintrc.js
├── .prettierrc
├── app.json
├── babel.config.js
├── metro.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📅 Implementation Phases

### Phase 1: Project Setup & Configuration (Week 1)

**Duration:** 5-7 days

**Tasks:**

1. **Initialize React Native Project**
   - Set up React Native CLI or Expo
   - Configure TypeScript
   - Set up folder structure
   - Install core dependencies
   - Configure Metro bundler

2. **Configure Development Environment**
   - Set up Android Studio
   - Set up Xcode (Mac only)
   - Configure emulators/simulators
   - Set up debugging tools (Flipper)

3. **Install & Configure Dependencies**
   - Navigation (React Navigation)
   - State management (Redux Toolkit / Zustand)
   - API client (Axios)
   - Storage (AsyncStorage, Secure Storage)
   - UI library (React Native Paper)

4. **Configure Native Modules**
   - Camera permissions
   - Storage permissions
   - Network info
   - Device info

5. **Set Up Theme & Styling**
   - Color palette
   - Typography
   - Spacing system
   - Component styles

**Deliverables:**
- Working React Native development environment
- Basic navigation structure
- Theme configuration
- Development documentation

---

### Phase 2: TensorFlow Lite Integration (Week 2)

**Duration:** 5-7 days

**Tasks:**

1. **Model Preparation**
   - Download MobileNetV2 TFLite model (25MB)
   - Convert labels to JSON format
   - Optimize model for mobile (if needed)
   - Add model to assets

2. **Android Configuration**
   - Add TensorFlow Lite dependencies to `build.gradle`
   - Configure asset loading
   - Set up permissions
   - Test model loading

3. **iOS Configuration**
   - Add TensorFlow Lite pod to `Podfile`
   - Configure asset loading
   - Set up permissions
   - Test model loading

4. **Inference Implementation**
   - Create model loader service
   - Implement image preprocessing
     - Resize to 224x224
     - Normalize pixel values
     - Convert to tensor format
   - Implement inference function
   - Implement result post-processing
   - Add error handling

5. **Testing**
   - Unit tests for preprocessing
   - Unit tests for inference
   - Integration tests
   - Performance benchmarking

**Deliverables:**
- Working TFLite model integration
- Image preprocessing pipeline
- Inference service
- Performance benchmarks (<500ms inference)

---

### Phase 3: Camera & Image Handling (Week 3)

**Duration:** 5-7 days

**Tasks:**

1. **Camera Integration**
   - Install react-native-vision-camera
   - Configure camera permissions
   - Create camera screen
   - Implement photo capture
   - Add camera preview
   - Add flash controls
   - Add focus/exposure controls

2. **Gallery Integration**
   - Install image picker
   - Implement gallery access
   - Add image selection
   - Handle multiple image formats

3. **Image Processing**
   - Install image cropper
   - Implement crop functionality
   - Add rotation
   - Add filters (optional)
   - Validate image quality
   - Optimize image size

4. **UI Development**
   - Camera screen UI
   - Image preview component
   - Crop/rotate interface
   - Loading indicators
   - Error handling

**Deliverables:**
- Functional camera with capture
- Gallery access
- Image cropping & editing
- Image validation

---

### Phase 4: Authentication & Backend Integration (Week 4)

**Duration:** 5-7 days

**Tasks:**

1. **Authentication UI**
   - Login screen
   - Register screen
   - Onboarding screens
   - Form validation
   - Error handling

2. **Authentication Logic**
   - API client setup
   - Login implementation
   - Register implementation
   - Token storage (secure)
   - Token refresh logic
   - Auto-login
   - Logout functionality

3. **Biometric Authentication**
   - Face ID / Touch ID integration
   - Biometric prompt
   - Fallback to password
   - Settings toggle

4. **Protected Navigation**
   - Auth state management
   - Protected routes
   - Auth flow navigation
   - Splash screen

**Deliverables:**
- Complete authentication flow
- Secure token management
- Biometric authentication
- Protected navigation

---

### Phase 5: Prediction Flow (Week 5)

**Duration:** 7-10 days

**Tasks:**

1. **Prediction Orchestration**
   - Integrate camera + ML inference
   - Implement prediction flow:
     1. Capture/select image
     2. Preprocess image
     3. Run inference
     4. Display results
   - Add loading states
   - Add error handling

2. **Result Display**
   - Create result screen
   - Display disease name
   - Show confidence score
   - Visualize top predictions (bar chart)
   - Add result actions (save, share, retake)

3. **Disease Information**
   - Fetch disease details from backend
   - Display symptoms
   - Display treatment recommendations
   - Display prevention tips
   - Add images/diagrams (optional)

4. **Local Storage**
   - Save predictions locally
   - Store images
   - Create local database schema
   - Implement CRUD operations

5. **Offline Queue**
   - Queue predictions for sync
   - Detect network status
   - Auto-sync when online
   - Show sync status

**Deliverables:**
- End-to-end prediction flow
- Local storage of predictions
- Disease information display
- Offline queue system

---

### Phase 6: Dashboard & History (Week 6)

**Duration:** 5-7 days

**Tasks:**

1. **Dashboard Screen**
   - Statistics cards
     - Total predictions
     - Diseases detected
     - Recent activity
   - Recent predictions list
   - Quick action buttons
   - Charts (optional)

2. **History Screen**
   - List all predictions
   - Pagination / Infinite scroll
   - Search functionality
   - Filter by disease, date
   - Sort options
   - Swipe actions (delete, share)

3. **Prediction Detail Screen**
   - Display full prediction details
   - Show original image
   - Disease information
   - Treatment recommendations
   - Edit/delete actions

4. **Analytics**
   - Predictions over time (chart)
   - Disease distribution (pie chart)
   - Most common diseases
   - Accuracy trends (optional)

**Deliverables:**
- User dashboard
- Prediction history
- Detail view
- Analytics visualization

---

### Phase 7: Settings & Additional Features (Week 7)

**Duration:** 5-7 days

**Tasks:**

1. **Profile Management**
   - View profile
   - Edit profile (name, email)
   - Change password
   - Profile picture (optional)
   - Account deletion

2. **App Settings**
   - Theme toggle (light/dark)
   - Language selection (i18n)
   - Notification settings
   - Data sync preferences
   - Model update settings
   - Cache management

3. **Disease Library**
   - List all diseases
   - Disease detail view
   - Search functionality
   - Bookmark diseases

4. **Additional Features**
   - Share predictions
   - Export history (CSV/PDF)
   - Notification system
   - Push notifications (optional)
   - Rate app prompt

**Deliverables:**
- Profile management
- App settings
- Disease library
- Additional features

---

### Phase 8: Testing & Optimization (Week 8)

**Duration:** 5-7 days

**Tasks:**

1. **Functional Testing**
   - Test all user flows
   - Test offline functionality
   - Test sync mechanism
   - Test error scenarios
   - Cross-device testing

2. **Performance Optimization**
   - Optimize image loading
   - Optimize model inference
   - Reduce bundle size
   - Optimize animations
   - Memory leak detection

3. **UI/UX Refinement**
   - Improve animations
   - Polish UI elements
   - Improve error messages
   - Add loading skeletons
   - Accessibility improvements

4. **Security Audit**
   - Secure token storage
   - API security
   - Data encryption
   - Permission handling
   - Code obfuscation

**Deliverables:**
- Fully tested application
- Performance optimizations
- UI/UX improvements
- Security hardening

---

### Phase 9: Deployment (Week 9)

**Duration:** 5-7 days

**Tasks:**

1. **Android Deployment**
   - Configure release build
   - Generate signing key
   - Build release APK/AAB
   - Test release build
   - Prepare Play Store listing
     - App description
     - Screenshots
     - Feature graphic
     - Privacy policy
   - Submit to Play Store
   - Review process

2. **iOS Deployment**
   - Configure release build
   - Create distribution certificate
   - Create provisioning profile
   - Build release IPA
   - Test release build
   - Prepare App Store listing
     - App description
     - Screenshots
     - App preview (optional)
     - Privacy policy
   - Submit to App Store
   - Review process

3. **Documentation**
   - User guide
   - Developer documentation
   - Deployment guide
   - API documentation

**Deliverables:**
- Android app on Google Play Store
- iOS app on Apple App Store
- Complete documentation

---

## ✅ Detailed Task Breakdown

### Phase 1 Tasks

#### 1.1 Initialize React Native Project

**Option A: React Native CLI (Recommended)**
```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new project
npx react-native init PlantDiseaseApp --template react-native-template-typescript

cd PlantDiseaseApp

# Install iOS dependencies (Mac only)
cd ios && pod install && cd ..

# Test Android
npx react-native run-android

# Test iOS (Mac only)
npx react-native run-ios
```

**Option B: Expo (Easier, but less native control)**
```bash
# Create Expo project
npx create-expo-app PlantDiseaseApp -t expo-template-blank-typescript

cd PlantDiseaseApp

# Install dependencies
npx expo install

# Start development server
npx expo start
```

#### 1.2 Install Core Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# State Management (choose one)
npm install @reduxjs/toolkit react-redux  # Redux
# OR
npm install zustand  # Zustand (simpler alternative)

# API & Server State
npm install axios @tanstack/react-query

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Storage
npm install @react-native-async-storage/async-storage
npm install react-native-encrypted-storage

# UI Components
npm install react-native-paper
npm install react-native-vector-icons
npm install react-native-reanimated
npm install react-native-gesture-handler

# Utilities
npm install @react-native-community/netinfo
npm install react-native-device-info
npm install date-fns
```

---

### Phase 2 Tasks

#### 2.1 TensorFlow Lite Integration

**Android (`android/app/build.gradle`):**
```gradle
android {
    ...
    aaptOptions {
        noCompress "tflite"
    }
}

dependencies {
    ...
    implementation 'org.tensorflow:tensorflow-lite:2.13.0'
    implementation 'org.tensorflow:tensorflow-lite-support:0.4.4'
}
```

**iOS (`ios/Podfile`):**
```ruby
target 'PlantDiseaseApp' do
  ...
  pod 'TensorFlowLiteSwift', '~> 2.13.0'
end
```

**Install React Native TFLite package:**
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native
npm install react-native-fs
npm install @react-native-community/async-storage  # For TFLite
npm install expo-gl  # If using Expo

# Link native modules
cd ios && pod install && cd ..
```

#### 2.2 Model Loading Service

**`src/services/ml/modelLoader.ts`:**
```typescript
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import RNFS from 'react-native-fs';

class ModelLoader {
  private model: tf.LayersModel | null = null;
  private labels: string[] = [];

  async loadModel(): Promise<void> {
    try {
      await tf.ready();

      // Load model
      const modelJSON = require('../../assets/model/model.json');
      const modelWeights = require('../../assets/model/weights.bin');

      this.model = await tf.loadLayersModel(
        bundleResourceIO(modelJSON, modelWeights)
      );

      // Load labels
      const labelsPath = `${RNFS.MainBundlePath}/assets/model/labels.json`;
      const labelsData = await RNFS.readFile(labelsPath);
      this.labels = JSON.parse(labelsData);

      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  getModel(): tf.LayersModel {
    if (!this.model) {
      throw new Error('Model not loaded');
    }
    return this.model;
  }

  getLabels(): string[] {
    return this.labels;
  }

  isLoaded(): boolean {
    return this.model !== null;
  }
}

export default new ModelLoader();
```

---

### Phase 3 Tasks

#### 3.1 Camera Integration

**Install camera package:**
```bash
npm install react-native-vision-camera
npm install react-native-permissions
```

**Configure permissions:**

**Android (`android/app/src/main/AndroidManifest.xml`):**
```xml
<manifest>
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" />
</manifest>
```

**iOS (`ios/PlantDiseaseApp/Info.plist`):**
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture plant images for disease detection</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select plant images</string>
```

---

## 🔌 API Integration

### Backend API Endpoints (Reuses Web App API)

The mobile app will use the same Laravel backend API as the web app:

**Base URL:** `https://yourdomain.com/api`

#### Key Endpoints for Mobile

1. **Authentication**
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `POST /api/auth/logout`
   - `GET /api/auth/user`

2. **Predictions (Cloud Sync)**
   - `POST /api/predictions` - Upload prediction result
   - `GET /api/predictions` - Fetch user history
   - `GET /api/predictions/{id}` - Get prediction details
   - `DELETE /api/predictions/{id}` - Delete prediction

3. **Dashboard**
   - `GET /api/dashboard/stats` - Get statistics
   - `GET /api/dashboard/analytics` - Get analytics

4. **Diseases**
   - `GET /api/diseases` - Get all diseases
   - `GET /api/diseases/{id}` - Get disease details

### API Client Configuration

**`src/services/api/client.ts`:**
```typescript
import axios from 'axios';
import { getSecureValue } from '../storage/secureStorage';
import Config from 'react-native-config';

const apiClient = axios.create({
  baseURL: Config.API_BASE_URL || 'https://yourdomain.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getSecureValue('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - logout user
      // Navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🤖 Model Integration

### TensorFlow Lite Model Specifications

**Model:** MobileNetV2
**File:** `MobileNetV2_20251027_200458_final.tflite`
**Size:** ~25 MB
**Input:** 224x224x3 (RGB image)
**Output:** Probabilities for each class

### Image Preprocessing

**`src/services/ml/preprocessor.ts`:**
```typescript
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

export class ImagePreprocessor {
  static async preprocess(imagePath: string): Promise<tf.Tensor> {
    try {
      // Read image file
      const imageData = await RNFS.readFile(imagePath, 'base64');
      const imageBuffer = Buffer.from(imageData, 'base64');

      // Decode image
      const imageTensor = decodeJpeg(new Uint8Array(imageBuffer));

      // Resize to 224x224
      const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);

      // Normalize to [0, 1]
      const normalized = resized.div(255.0);

      // Add batch dimension [1, 224, 224, 3]
      const batched = normalized.expandDims(0);

      return batched;
    } catch (error) {
      console.error('Error preprocessing image:', error);
      throw error;
    }
  }
}
```

### Inference

**`src/services/ml/predictor.ts`:**
```typescript
import * as tf from '@tensorflow/tfjs';
import modelLoader from './modelLoader';
import { ImagePreprocessor } from './preprocessor';

export interface PredictionResult {
  predictedClass: string;
  confidence: number;
  allPredictions: Array<{ class: string; confidence: number }>;
  inferenceTime: number;
}

export class Predictor {
  async predict(imagePath: string): Promise<PredictionResult> {
    const startTime = Date.now();

    try {
      // Load model if not loaded
      if (!modelLoader.isLoaded()) {
        await modelLoader.loadModel();
      }

      const model = modelLoader.getModel();
      const labels = modelLoader.getLabels();

      // Preprocess image
      const inputTensor = await ImagePreprocessor.preprocess(imagePath);

      // Run inference
      const predictions = model.predict(inputTensor) as tf.Tensor;
      const predictionArray = await predictions.data();

      // Get top predictions
      const topPredictions = Array.from(predictionArray)
        .map((confidence, index) => ({
          class: labels[index],
          confidence,
        }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

      const inferenceTime = (Date.now() - startTime) / 1000;

      // Cleanup tensors
      inputTensor.dispose();
      predictions.dispose();

      return {
        predictedClass: topPredictions[0].class,
        confidence: topPredictions[0].confidence,
        allPredictions: topPredictions,
        inferenceTime,
      };
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }
}

export default new Predictor();
```

---

## 🚀 Deployment Strategy

### Android Deployment

#### 1. Generate Signing Key
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. Configure Gradle

**`android/gradle.properties`:**
```properties
RELEASE_STORE_FILE=release.keystore
RELEASE_KEY_ALIAS=release
RELEASE_STORE_PASSWORD=your_password
RELEASE_KEY_PASSWORD=your_password
```

**`android/app/build.gradle`:**
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file(RELEASE_STORE_FILE)
            storePassword RELEASE_STORE_PASSWORD
            keyAlias RELEASE_KEY_ALIAS
            keyPassword RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 3. Build Release APK/AAB
```bash
cd android
./gradlew bundleRelease  # For AAB (Play Store)
# OR
./gradlew assembleRelease  # For APK

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

#### 4. Google Play Store Submission
1. Create developer account ($25 one-time fee)
2. Create app listing
3. Add screenshots (phone + tablet)
4. Write description
5. Set content rating
6. Upload AAB
7. Submit for review

---

### iOS Deployment

#### 1. Configure Xcode
1. Open `ios/PlantDiseaseApp.xcworkspace`
2. Select project in navigator
3. Set Bundle Identifier (e.g., `com.yourcompany.plantdisease`)
4. Set Version & Build number
5. Select signing certificate (Apple Developer account required)

#### 2. Archive Build
1. Select "Any iOS Device (arm64)" as target
2. Product → Archive
3. Wait for archive to complete
4. Organizer window opens

#### 3. Distribute
1. Click "Distribute App"
2. Select "App Store Connect"
3. Follow wizard
4. Upload to App Store

#### 4. App Store Connect
1. Create app listing
2. Add screenshots (iPhone + iPad)
3. Write description
4. Set pricing
5. Submit for review

---

### Environment Configuration

**`.env.example`:**
```env
# API Configuration
API_BASE_URL=https://yourdomain.com/api
API_TIMEOUT=30000

# App Configuration
APP_NAME=Plant Disease Detector
APP_VERSION=1.0.0

# Feature Flags
ENABLE_BIOMETRIC_AUTH=true
ENABLE_OFFLINE_MODE=true
ENABLE_ANALYTICS=false

# Storage
MAX_HISTORY_SIZE=100
CACHE_EXPIRY_DAYS=30
```

---

## 🧪 Testing Strategy

### Unit Testing (Jest)

**Install testing dependencies:**
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

**Example test (`__tests__/services/predictor.test.ts`):**
```typescript
import predictor from '../../src/services/ml/predictor';

describe('Predictor', () => {
  it('should predict disease from image', async () => {
    const result = await predictor.predict('test-image.jpg');

    expect(result).toHaveProperty('predictedClass');
    expect(result).toHaveProperty('confidence');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});
```

### Integration Testing

**Test user flows:**
1. Login → Dashboard → Camera → Prediction → History
2. Offline prediction → Online sync
3. Error handling

### E2E Testing (Detox - Optional)

```bash
npm install --save-dev detox
```

---

## 📊 Success Metrics

### Performance Metrics
- App launch time: < 2 seconds
- Inference time: < 500ms
- Image processing time: < 1 second
- API response time: < 1 second

### Quality Metrics
- Crash-free rate: > 99%
- Test coverage: > 70%
- App size: < 50 MB

### User Experience
- Intuitive UI/UX
- Smooth animations (60 FPS)
- Offline functionality
- Fast navigation

---

## 🔐 Security Considerations

1. **Secure Storage**
   - Encrypted storage for auth tokens
   - Biometric authentication
   - Auto-logout after inactivity

2. **API Security**
   - HTTPS only
   - Token-based authentication
   - Certificate pinning (optional)

3. **Data Privacy**
   - Local-first architecture
   - Minimal data collection
   - User consent for cloud sync

4. **Code Security**
   - ProGuard (Android)
   - Code obfuscation
   - Root/jailbreak detection (optional)

---

## 📝 Next Steps

1. **Review this implementation plan**
2. **Set up development environment** (Phase 1)
3. **Integrate TensorFlow Lite model** (Phase 2)
4. **Build camera & inference flow** (Phase 3-5)
5. **Test thoroughly** (Phase 8)
6. **Deploy to stores** (Phase 9)

---

## 🤝 Collaboration with Web App

**Shared Components:**
- Backend API (Laravel)
- Database schema
- Disease information
- Treatment recommendations
- User accounts (shared login)

**Mobile-Specific:**
- TensorFlow Lite model (optimized for mobile)
- Offline-first architecture
- Camera integration
- Native performance

---

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TensorFlow Lite for Mobile](https://www.tensorflow.org/lite/guide)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)

---

**Last Updated:** 2025-11-06
**Version:** 1.0
**Status:** Ready for Implementation
