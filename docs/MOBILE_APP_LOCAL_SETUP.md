# Mobile App Local Setup Guide

Complete guide to set up and run the Plant Disease Detector mobile app locally.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Running the App](#running-the-app)
5. [Development](#development)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

## Prerequisites

### Required Software

#### For All Platforms
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

#### For Android Development
- **Android Studio** ([Download](https://developer.android.com/studio))
  - Android SDK Platform 33 or higher
  - Android SDK Build-Tools 33.0.0 or higher
  - Android Emulator (optional, for testing)
- **Java Development Kit (JDK)** 17 ([Download](https://adoptium.net/))

#### For iOS Development (macOS only)
- **Xcode** >= 14.0 ([Download from App Store](https://apps.apple.com/app/xcode/id497799835))
- **CocoaPods** ([Installation guide](https://cocoapods.org/))
  ```bash
  sudo gem install cocoapods
  ```
- **Xcode Command Line Tools**
  ```bash
  xcode-select --install
  ```

### Environment Setup

#### Android Setup

1. **Install Android Studio** and during installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

2. **Configure ANDROID_HOME environment variable**:

   **On macOS/Linux** (add to `~/.bash_profile` or `~/.zshrc`):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   **On Windows** (add to System Environment Variables):
   ```
   ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
   ```

3. **Reload your shell**:
   ```bash
   source ~/.zshrc  # or source ~/.bash_profile
   ```

#### iOS Setup (macOS only)

1. **Install Xcode** from the App Store

2. **Install Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

3. **Install CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```

4. **Accept Xcode license**:
   ```bash
   sudo xcodebuild -license accept
   ```

## Project Structure

```
mobile-app/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Common components (buttons, cards, etc.)
│   │   ├── camera/        # Camera-related components (Phase 3)
│   │   ├── prediction/    # Prediction display components (Phase 5)
│   │   ├── auth/          # Authentication components (Phase 4)
│   │   ├── history/       # History screen components (Phase 6)
│   │   └── settings/      # Settings components (Phase 7)
│   ├── screens/           # App screens
│   │   ├── SplashScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── CameraScreen.tsx (placeholder)
│   │   ├── HistoryScreen.tsx (placeholder)
│   │   └── SettingsScreen.tsx (placeholder)
│   ├── navigation/        # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   ├── services/          # API and services
│   │   ├── api/          # API client (Phase 4)
│   │   ├── ml/           # TensorFlow Lite service (Phase 2)
│   │   ├── storage/      # AsyncStorage utilities
│   │   └── auth/         # Authentication service (Phase 4)
│   ├── store/            # Redux state management
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── predictionSlice.ts
│   │   │   ├── mlSlice.ts
│   │   │   └── appSlice.ts
│   │   ├── selectors/    # Redux selectors
│   │   └── index.ts
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   │   ├── index.ts
│   │   └── navigation.ts
│   ├── utils/            # Utility functions
│   ├── theme/            # Theme configuration (colors, typography, spacing)
│   │   ├── colors.ts     # Emerald/Teal color palette
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── assets/           # Static assets
│   │   ├── images/       # Image files
│   │   ├── models/       # TensorFlow Lite models (Phase 2)
│   │   └── fonts/        # Custom fonts (if any)
│   └── config/           # App configuration
│       └── index.ts      # API URLs, ML config, constants
├── android/              # Android native code
├── ios/                  # iOS native code
├── App.tsx               # Main App component
├── index.js              # App entry point
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── babel.config.js       # Babel config (with path aliases)
├── metro.config.js       # Metro bundler config
├── .eslintrc.js          # ESLint config
└── .prettierrc           # Prettier config
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/is-project-4th-year/AI-Based-Tomato-and-Potato-Disease-Classification-App.git
cd AI-Based-Tomato-and-Potato-Disease-Classification-App/mobile-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native 0.73.2
- React Navigation (Stack & Bottom Tabs)
- Redux Toolkit
- Lucide React Native (icons)
- TensorFlow.js (for Phase 2)
- React Native Camera & Image libraries (for Phase 3)
- And many more...

### 3. iOS-Specific Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

This installs iOS native dependencies using CocoaPods.

### 4. Android-Specific Setup

No additional setup required for Android. Metro bundler will handle everything.

## Running the App

### Development Mode

#### Start Metro Bundler

In the project root (`mobile-app/`), start the Metro bundler:

```bash
npm start
```

This will start the Metro development server. Keep this terminal open.

#### Run on Android

Open a new terminal and run:

```bash
npm run android
```

Or manually:
```bash
npx react-native run-android
```

**Prerequisites:**
- Android device connected via USB with USB debugging enabled, OR
- Android emulator running (from Android Studio AVD Manager)

#### Run on iOS (macOS only)

Open a new terminal and run:

```bash
npm run ios
```

Or manually:
```bash
npx react-native run-ios
```

**Prerequisites:**
- iOS Simulator (automatically launched), OR
- Physical iOS device connected (requires Apple Developer account)

To run on a specific iOS device:
```bash
npx react-native run-ios --device "iPhone Name"
```

### Production Build

#### Android APK

```bash
cd android
./gradlew assembleRelease
```

APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

#### iOS IPA (macOS only)

1. Open Xcode:
   ```bash
   open ios/PlantDiseaseApp.xcworkspace
   ```

2. Select "Product" > "Archive"

3. Follow Xcode's distribution wizard

## Development

### Code Style

The project uses:
- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run linting:
```bash
npm run lint
```

Format code (automatically done by your IDE if configured):
```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

### Path Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of:
import Button from '../../../../components/common/Button';

// Use:
import Button from '@components/common/Button';
```

Available aliases:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@screens/*` → `src/screens/*`
- `@navigation/*` → `src/navigation/*`
- `@services/*` → `src/services/*`
- `@store/*` → `src/store/*`
- `@hooks/*` → `src/hooks/*`
- `@types/*` → `src/types/*`
- `@utils/*` → `src/utils/*`
- `@theme/*` → `src/theme/*`
- `@config/*` → `src/config/*`
- `@assets/*` → `src/assets/*`

### Theme System

The app uses a comprehensive theme system matching the webapp:

**Colors**: Emerald (primary) + Teal (secondary) gradient theme
```typescript
import {colors} from '@theme';

<View style={{backgroundColor: colors.primary[600]}} />
<Text style={{color: colors.text.primary}}>Hello</Text>
```

**Typography**:
```typescript
import {typography} from '@theme';

<Text style={typography.h1}>Heading</Text>
<Text style={typography.body}>Body text</Text>
```

**Spacing**:
```typescript
import {spacing} from '@theme';

<View style={{padding: spacing.lg, marginBottom: spacing['2xl']}} />
```

**Glassmorphism Styles**:
```typescript
import {glassStyles} from '@theme';

<View style={glassStyles.card}>
  {/* Content */}
</View>
```

### Icons

The app uses **Lucide React Native** icons (matching webapp):

```typescript
import {Camera, Home, User} from 'lucide-react-native';

<Camera color={colors.primary[600]} size={24} />
```

**DO NOT use emojis** - only Lucide icons for consistency.

### State Management

The app uses Redux Toolkit for state management:

```typescript
import {useAppSelector, useAppDispatch} from '@store';
import {setUser} from '@store/slices/authSlice';

// In component:
const user = useAppSelector(state => state.auth.user);
const dispatch = useAppDispatch();
```

Available slices:
- `auth` - Authentication state
- `predictions` - Prediction history
- `ml` - ML model state
- `app` - App-wide state (connectivity, theme)

### Navigation

Type-safe navigation using React Navigation:

```typescript
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const navigation = useNavigation<NavigationProp>();
navigation.navigate('Login');
navigation.navigate('PredictionDetail', {predictionId: 123});
```

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Errors

**Clear cache and restart:**
```bash
npm start -- --reset-cache
```

#### 2. Android Build Fails

**Clean Android build:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Check ANDROID_HOME:**
```bash
echo $ANDROID_HOME  # Should output SDK path
```

#### 3. iOS Build Fails

**Clean iOS build:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

**Check pods installation:**
```bash
cd ios
pod install --repo-update
cd ..
```

#### 4. TypeScript Errors

**Regenerate types:**
```bash
npm run lint
```

#### 5. "Unable to resolve module" Errors

**Clear watchman and restart:**
```bash
watchman watch-del-all
rm -rf node_modules
npm install
npm start -- --reset-cache
```

#### 6. Xcode "Developer Disk Image Not Found"

Update Xcode to the latest version that supports your iOS device version.

### Getting Help

- Check [React Native docs](https://reactnative.dev/docs/getting-started)
- Check [React Navigation docs](https://reactnavigation.org/docs/getting-started)
- Check implementation plan: `docs/MOBILE_APP_IMPLEMENTATION_PLAN.md`
- Open an issue in the repository

## Next Steps

### Phase 1: ✅ Complete
- [x] Project setup
- [x] Navigation structure
- [x] Theme configuration
- [x] Basic screens (Splash, Welcome, Login, Register, Dashboard placeholders)

### Phase 2: TensorFlow Lite Integration (Coming Next)
- [ ] Download MobileNetV2 TFLite model
- [ ] Implement model loader
- [ ] Create preprocessing pipeline
- [ ] Build inference engine
- [ ] Test on-device prediction

### Phase 3: Camera & Image Handling
- [ ] Integrate react-native-vision-camera
- [ ] Implement gallery access
- [ ] Add crop/rotate functionality
- [ ] Build image validation

### Phase 4: Authentication & Backend
- [ ] Connect to Laravel 12 backend
- [ ] Implement login/register APIs
- [ ] Add token storage
- [ ] Integrate biometric auth

### Phase 5: Prediction Flow
- [ ] Wire camera → preprocessing → inference
- [ ] Build result display
- [ ] Implement offline queue
- [ ] Add local storage

### Phase 6: Dashboard & History
- [ ] Build full dashboard
- [ ] Create history screen
- [ ] Add analytics
- [ ] Implement cloud sync

### Phase 7-9: Features, Testing, Deployment
- [ ] Profile management
- [ ] Settings implementation
- [ ] Performance optimization
- [ ] Release builds

## Configuration

### API Endpoints

Configure backend URLs in `src/config/index.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:8000' : 'https://api.plantdisease.app',
  API_URL: __DEV__ ? 'http://localhost:8000/api' : 'https://api.plantdisease.app/api',
  // ... more config
};
```

### ML Model Configuration

Configure TensorFlow Lite model in `src/config/index.ts`:

```typescript
export const ML_CONFIG = {
  MODEL_NAME: 'MobileNetV2_20251027_200458_final.tflite',
  MODEL_PATH: 'models/MobileNetV2_20251027_200458_final.tflite',
  INPUT_SIZE: 224,
  NUM_CLASSES: 13,
  // ... more config
};
```

## Development Tips

1. **Use React DevTools**: Install React Native Debugger for better debugging
2. **Enable Fast Refresh**: Automatically enabled in RN 0.73
3. **Use TypeScript**: Leverage type checking for fewer runtime errors
4. **Follow the theme system**: Use theme values instead of hardcoded colors/spacing
5. **Use Lucide icons**: Consistent with webapp, no emojis
6. **Test on real devices**: Emulators don't always reflect real performance
7. **Monitor bundle size**: Keep app size optimized (TFLite model is 25MB)

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TensorFlow Lite](https://www.tensorflow.org/lite)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Happy Coding! 🚀**

For questions or issues, please open an issue in the repository or contact the development team.
