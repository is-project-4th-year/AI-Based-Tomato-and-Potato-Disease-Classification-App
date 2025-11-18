/**
 * Theme Configuration
 * Central theme export matching webapp branding
 */

import {colors} from './colors';
import {spacing, borderRadius, shadows} from './spacing';
import {typography} from './typography';

export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} as const;

export type Theme = typeof theme;

// Export individual modules
export {colors} from './colors';
export {spacing, borderRadius, shadows} from './spacing';
export {typography} from './typography';

// Common component styles (glassmorphism effect matching webapp)
export const glassStyles = {
  card: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: colors.surface.border,
    ...shadows.xl,
  },
  container: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: colors.surface.border,
    ...shadows.md,
  },
  button: {
    primary: {
      borderRadius: borderRadius.xl,
      ...shadows.md,
    },
    secondary: {
      backgroundColor: colors.surface.white,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.gray[200],
      ...shadows.sm,
    },
  },
  input: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },
} as const;

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Default theme export
export default theme;
