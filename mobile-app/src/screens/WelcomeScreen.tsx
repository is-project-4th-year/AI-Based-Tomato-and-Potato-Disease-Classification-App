/**
 * Welcome Screen
 * Onboarding screen for new users
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Sparkles, Zap, Target, Lightbulb} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '@types/navigation';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <LinearGradient
      colors={[colors.background.gradient.from, colors.background.gradient.via, colors.background.gradient.to]}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Sparkles color={colors.white} size={56} />
          </View>
          <Text style={styles.title}>Plant Disease Detector</Text>
          <Text style={styles.subtitle}>Protect your crops with AI-powered disease detection</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureCard
            icon={<Zap color={colors.warning.main} size={28} />}
            title="Fast Detection"
            description="Get instant results with on-device AI"
          />
          <FeatureCard
            icon={<Target color={colors.info.main} size={28} />}
            title="High Accuracy"
            description="95%+ accuracy across 13 disease classes"
          />
          <FeatureCard
            icon={<Lightbulb color={colors.primary[600]} size={28} />}
            title="Expert Advice"
            description="Detailed treatment recommendations"
          />
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.primary[500], colors.secondary[600]]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientButton}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
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
}

const FeatureCard: React.FC<FeatureCardProps> = ({icon, title, description}) => (
  <View style={styles.featureCard}>
    <View style={styles.iconContainer}>{icon}</View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing['2xl'],
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing['6xl'],
    marginBottom: spacing['4xl'],
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    ...shadows.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  features: {
    marginBottom: spacing['4xl'],
  },
  featureCard: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    ...shadows.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  featureTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  buttons: {
    marginTop: 'auto',
    paddingBottom: spacing['3xl'],
  },
  primaryButton: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  gradientButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  secondaryButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});

export default WelcomeScreen;
