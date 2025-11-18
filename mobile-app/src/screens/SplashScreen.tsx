/**
 * Splash Screen
 * Initial loading screen with app branding
 */

import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Sparkles} from 'lucide-react-native';

import {colors, typography, spacing} from '@theme';

const SplashScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={[colors.background.gradient.from, colors.background.gradient.via, colors.background.gradient.to]}
      style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Sparkles color={colors.white} size={64} />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>Plant Disease</Text>
        <Text style={styles.appName}>Detector</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>AI-Powered Plant Health Analysis</Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      </View>

      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: `${colors.primary[600]}`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
    shadowColor: colors.primary[600],
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  appName: {
    ...typography.h1,
    color: colors.primary[700],
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -1,
  },
  tagline: {
    ...typography.body,
    color: colors.gray[600],
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: spacing['5xl'],
  },
  version: {
    ...typography.captionSmall,
    color: colors.gray[500],
    marginBottom: spacing['3xl'],
  },
});

export default SplashScreen;
