/**
 * Typography System
 * Based on system fonts with fallbacks
 */

import {Platform} from 'react-native';

const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  semiBold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
};

const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const typography = {
  // Display styles
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
  },

  // Heading styles
  h1: {
    fontSize: 36,
    lineHeight: 40,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
  },
  h2: {
    fontSize: 30,
    lineHeight: 36,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight.semiBold,
  },
  h5: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight.semiBold,
  },
  h6: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight.semiBold,
  },

  // Body styles
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
  },

  // Label styles
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
  },

  // Caption styles
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
  },
  captionSmall: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
  },

  // Button styles
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight.semiBold,
  },
  buttonSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight.semiBold,
  },
} as const;

export type Typography = typeof typography;
