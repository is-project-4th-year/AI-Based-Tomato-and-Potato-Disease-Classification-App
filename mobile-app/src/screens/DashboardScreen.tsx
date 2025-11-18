/**
 * Dashboard Screen
 * Main screen for plant disease analysis
 * Full implementation in Phase 5
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Sparkles, Camera, History} from 'lucide-react-native';

import {colors, typography, spacing, borderRadius, shadows} from '@theme';

const DashboardScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={[colors.background.gradient.from, colors.background.gradient.via, colors.background.gradient.to]}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Sparkles color={colors.white} size={32} />
          </View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to Plant Disease Detector</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Camera color={colors.primary[600]} size={48} />
          <Text style={styles.infoTitle}>Ready to Analyze</Text>
          <Text style={styles.infoText}>
            Tap the camera button below to take a photo or select an image from your gallery.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureCard
            icon={<Camera color={colors.primary[600]} size={24} />}
            title="Quick Scan"
            description="Take a photo to analyze"
            badge="Coming Soon"
          />
          <FeatureCard
            icon={<History color={colors.secondary[600]} size={24} />}
            title="View History"
            description="See your past scans"
            badge="Phase 6"
          />
        </View>

        {/* Implementation Notice */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Development Status</Text>
          <Text style={styles.noticeText}>
            Phase 1: Setup & Navigation ✓{'\n'}
            Phase 2: TensorFlow Lite Integration{'\n'}
            Phase 3: Camera & Image Handling{'\n'}
            Phase 4: Authentication & Backend{'\n'}
            Phase 5: Prediction Flow{'\n'}
            Phase 6: Dashboard & History{'\n'}
            Phase 7-9: Features, Testing, Deployment
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({icon, title, description, badge}) => (
  <View style={styles.featureCard}>
    <View style={styles.featureIcon}>{icon}</View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
    {badge && <View style={styles.badge}>
      <Text style={styles.badgeText}>{badge}</Text>
    </View>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['5xl'],
    paddingBottom: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.lg,
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
  },
  infoCard: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing['3xl'],
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.surface.border,
    ...shadows.md,
  },
  infoTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  features: {
    marginBottom: spacing['2xl'],
  },
  featureCard: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surface.border,
    ...shadows.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.h6,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  badge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  badgeText: {
    ...typography.captionSmall,
    color: colors.primary[700],
    fontWeight: '600',
  },
  noticeCard: {
    backgroundColor: colors.info.light,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.info.main,
  },
  noticeTitle: {
    ...typography.h6,
    color: colors.info.text,
    marginBottom: spacing.sm,
  },
  noticeText: {
    ...typography.bodySmall,
    color: colors.info.text,
    lineHeight: 20,
  },
});

export default DashboardScreen;
