/**
 * History Screen
 * View past predictions and analysis
 * Full implementation in Phase 6
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {History} from 'lucide-react-native';

import {colors, typography, spacing, borderRadius, shadows} from '@theme';

const HistoryScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={[colors.background.gradient.from, colors.background.gradient.via, colors.background.gradient.to]}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <History color={colors.secondary[600]} size={64} />
        </View>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Prediction history coming in Phase 6</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            This screen will include:{'\n\n'}
            • List of all past predictions{'\n'}
            • Filter by plant type & date{'\n'}
            • View prediction details{'\n'}
            • Delete old predictions{'\n'}
            • Sync with cloud storage{'\n'}
            • Export reports
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

export default HistoryScreen;
