/**
 * Main App Component
 * Root component with Redux Provider and Navigation
 */

import React, {useEffect} from 'react';
import {StatusBar, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {store} from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import {colors} from './src/theme';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize app services here
    // - Load auth token from storage
    // - Load ML model
    // - Setup network listener
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background.default}
          translucent={Platform.OS === 'android'}
        />
        <RootNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
