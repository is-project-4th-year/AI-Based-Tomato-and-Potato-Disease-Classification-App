/**
 * Settings Screen
 * App settings and user profile management
 * Full implementation in Phase 7
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Settings, User, Bell, Shield, HelpCircle, LogOut} from 'lucide-react-native';

import {colors, typography, spacing, borderRadius, shadows} from '@theme';

const SettingsScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={[colors.background.gradient.from, colors.background.gradient.via, colors.background.gradient.to]}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Settings color={colors.white} size={32} />
          </View>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your account and preferences</Text>
        </View>

        {/* Settings Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsItem
            icon={<User color={colors.primary[600]} size={20} />}
            title="Profile"
            description="Manage your profile information"
            badge="Phase 7"
          />
          <SettingsItem
            icon={<Bell color={colors.primary[600]} size={20} />}
            title="Notifications"
            description="Configure notification preferences"
            badge="Phase 7"
          />
          <SettingsItem
            icon={<Shield color={colors.primary[600]} size={20} />}
            title="Privacy & Security"
            description="Biometric auth, data settings"
            badge="Phase 7"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingsItem
            icon={<HelpCircle color={colors.secondary[600]} size={20} />}
            title="Help & Support"
            description="Get help and contact us"
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <LogOut color={colors.error.main} size={20} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Plant Disease Detector v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2025 All Rights Reserved</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Settings Item Component
interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({icon, title, description, badge}) => (
  <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7}>
    <View style={styles.itemIcon}>{icon}</View>
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
    </View>
    {badge && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
  </TouchableOpacity>
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
  iconContainer: {
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
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  settingsItem: {
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
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    ...typography.h6,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  itemDescription: {
    ...typography.captionSmall,
    color: colors.text.secondary,
  },
  badge: {
    backgroundColor: colors.warning.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  badgeText: {
    ...typography.captionSmall,
    color: colors.warning.dark,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.error.light,
    ...shadows.sm,
  },
  logoutText: {
    ...typography.button,
    color: colors.error.main,
    marginLeft: spacing.sm,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: spacing['4xl'],
  },
  appInfoText: {
    ...typography.captionSmall,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
});

export default SettingsScreen;
