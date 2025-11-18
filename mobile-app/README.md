# Plant Disease Detector - Mobile App

React Native mobile application for AI-powered plant disease detection using on-device TensorFlow Lite inference.

## Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9
- Android Studio (for Android) or Xcode (for iOS, macOS only)

### Installation

```bash
# Install dependencies
npm install

# iOS only - install pods
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on Android (in new terminal)
npm run android

# Run on iOS (in new terminal, macOS only)
npm run ios
```

## Documentation

📚 **Complete setup guide**: [`../docs/MOBILE_APP_LOCAL_SETUP.md`](../docs/MOBILE_APP_LOCAL_SETUP.md)

This guide includes:
- Detailed prerequisites and environment setup
- Complete project structure explanation
- Installation instructions for Android and iOS
- Development workflow and best practices
- Troubleshooting common issues
- Next steps and implementation phases

## Tech Stack

- **Framework**: React Native 0.73.2
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Redux Toolkit
- **UI Library**: React Native Paper + Custom glassmorphism components
- **Icons**: Lucide React Native (**NO emojis**)
- **ML**: TensorFlow Lite (on-device inference)
- **Camera**: React Native Vision Camera
- **Backend**: Laravel 12 API (shared with webapp)
- **Theme**: Emerald + Teal gradient (matching webapp)

## Project Structure

```
mobile-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens
│   ├── navigation/      # Navigation configuration
│   ├── services/        # API and ML services
│   ├── store/           # Redux state management
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── theme/           # Theme (colors, typography, spacing)
│   ├── assets/          # Static assets (images, models)
│   └── config/          # App configuration
├── android/             # Android native code
├── ios/                 # iOS native code
├── App.tsx              # Main App component
└── index.js             # App entry point
```

## Features

### Phase 1: ✅ Complete (Setup & Navigation)
- Project initialization with TypeScript
- Complete folder structure
- Theme system with emerald/teal branding
- Navigation (Stack + Bottom Tabs)
- Basic screens (Splash, Welcome, Login, Register, Dashboard)
- Redux store setup
- Path aliases for clean imports

### Phase 2-9: Coming Soon
- **Phase 2**: TensorFlow Lite integration (25MB MobileNetV2 model)
- **Phase 3**: Camera and image handling
- **Phase 4**: Authentication and backend integration
- **Phase 5**: Prediction flow (camera → ML → results)
- **Phase 6**: Dashboard and history screens
- **Phase 7**: Settings and profile management
- **Phase 8**: Testing and optimization
- **Phase 9**: Production builds and deployment

## Development

### Code Style
- ESLint for linting: `npm run lint`
- Prettier for formatting
- TypeScript for type safety

### Path Aliases
```typescript
import Button from '@components/common/Button';
import {colors} from '@theme';
import type {User} from '@types';
```

### Theme Usage
```typescript
import {colors, typography, spacing, glassStyles} from '@theme';

// Colors (emerald/teal palette)
<View style={{backgroundColor: colors.primary[600]}} />

// Typography
<Text style={typography.h1}>Heading</Text>

// Spacing
<View style={{padding: spacing.lg}} />

// Glassmorphism
<View style={glassStyles.card}>Content</View>
```

### Icons (Lucide Only)
```typescript
import {Camera, Home, User} from 'lucide-react-native';

<Camera color={colors.primary[600]} size={24} />
```

## Scripts

```bash
# Development
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios            # Run on iOS

# Maintenance
npm run lint           # Lint code
npm run clean          # Clean build artifacts
npm run pod-install    # Reinstall iOS pods
```

## Troubleshooting

### Clear cache
```bash
npm start -- --reset-cache
```

### Clean Android build
```bash
cd android && ./gradlew clean && cd ..
```

### Clean iOS build
```bash
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

## Configuration

### Backend API
Configure in `src/config/index.ts`:
```typescript
BASE_URL: __DEV__ ? 'http://localhost:8000' : 'https://api.plantdisease.app'
```

### ML Model
- Model: MobileNetV2 (TFLite, 25MB)
- Input size: 224x224
- Classes: 13 disease categories
- On-device inference for privacy and speed

## Design Principles

1. **Offline-first**: ML runs on-device, works without internet
2. **Privacy**: No images sent to server (optional sync)
3. **Performance**: Fast inference (<500ms target)
4. **UX**: Match webapp design with glassmorphism and emerald/teal branding
5. **Accessibility**: Clear icons (Lucide), proper contrast, readable fonts

## Backend Integration

The mobile app connects to the same Laravel 12 backend as the webapp:

- **Authentication**: Laravel Sanctum tokens
- **Predictions**: Store results in cloud (optional)
- **History**: Sync across devices
- **Disease Info**: Fetch treatment recommendations

## Model Details

- **Model**: MobileNetV2 (TensorFlow Lite)
- **Size**: 25MB
- **Input**: 224x224 RGB image
- **Output**: 13 class probabilities
- **Classes**:
  - Potato: Early blight, Late blight, Healthy
  - Tomato: 9 disease classes + Healthy

## Contributing

1. Follow existing code style
2. Use TypeScript
3. Match webapp branding
4. Use Lucide icons only
5. Test on both platforms
6. Update documentation

## Resources

- [Complete Setup Guide](../docs/MOBILE_APP_LOCAL_SETUP.md)
- [Implementation Plan](../docs/MOBILE_APP_IMPLEMENTATION_PLAN.md)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

## License

© 2025 Plant Disease Detector. All Rights Reserved.

---

**Development Status**: Phase 1 Complete ✅
**Next Phase**: TensorFlow Lite Integration (Phase 2)
