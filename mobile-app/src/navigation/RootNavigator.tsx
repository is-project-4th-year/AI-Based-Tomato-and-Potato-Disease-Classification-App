/**
 * Root Navigator
 * Main navigation structure for the entire app
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

import type {RootStackParamList} from '@types/navigation';
import type {RootState} from '@types';

// Screens (will be implemented in phases)
import SplashScreen from '@screens/SplashScreen';
import WelcomeScreen from '@screens/WelcomeScreen';
import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const {isAuthenticated, isLoading} = useSelector((state: RootState) => state.auth);
  const [isAppReady, setIsAppReady] = React.useState(false);

  React.useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady || isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            {/* Add modal screens here */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
