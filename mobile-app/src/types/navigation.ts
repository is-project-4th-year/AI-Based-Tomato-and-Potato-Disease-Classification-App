/**
 * Navigation Type Definitions
 * For type-safe navigation throughout the app
 */

import type {StackScreenProps} from '@react-navigation/stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';

// Root Stack Navigator
export type RootStackParamList = {
  // Auth Stack
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;

  // Main App
  MainTabs: undefined;

  // Detail Screens (Modal/Full Screen)
  PredictionDetail: {predictionId: number | string; isLocal?: boolean};
  DiseaseInfo: {diseaseId: number};
  Profile: undefined;
  EditProfile: undefined;
  ImagePreview: {imageUri: string};
};

// Bottom Tab Navigator
export type BottomTabParamList = {
  DashboardTab: undefined;
  CameraTab: undefined;
  HistoryTab: undefined;
  SettingsTab: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type BottomTabScreenProps<T extends keyof BottomTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

// Declare global navigation types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
