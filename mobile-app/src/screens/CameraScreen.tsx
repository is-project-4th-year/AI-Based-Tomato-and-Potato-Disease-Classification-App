/**
 * Camera Screen
 * Camera interface for capturing plant images
 * Full implementation in Phase 3
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Camera} from 'lucide-react-native';

import {colors, typography, spacing, borderRadius, shadows} from '@theme';

const CameraScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={[colors.background.gradient.from, colors.background.gradient.via, colors.background.gradient.to]}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Camera color={colors.primary[600]} size={64} />
        </View>
        <Text style={styles.title}>Camera</Text>
        <Text style={styles.subtitle}>Camera integration coming in Phase 3</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            This screen will include:{'\n\n'}
            • Real-time camera preview{'\n'}
            • Capture photo for analysis{'\n'}
            • Gallery image selection{'\n'}
            • Image crop and rotate{'\n'}
            • Immediate disease prediction
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: colors.surface.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    ...shadows.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },
  card: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    width: '100%',
    borderWidth: 1,
    borderColor: colors.surface.border,
    ...shadows.md,
  },
  cardText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
});

export default CameraScreen;
