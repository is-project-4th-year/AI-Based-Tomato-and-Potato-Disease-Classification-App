/**
 * Color Palette - Matching Web App Branding
 * Emerald (Primary) + Teal (Secondary) gradient theme
 */

export const colors = {
  // Primary Colors - Emerald Palette
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981', // Main emerald color
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Secondary Colors - Teal Palette
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main teal color
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Accent Colors
  accent: {
    cyan: {
      200: '#a5f3fc',
      500: '#06b6d4',
    },
  },

  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic Colors
  success: {
    light: '#dcfce7',
    main: '#10b981',
    dark: '#047857',
    text: '#065f46',
  },

  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#d97706',
    text: '#92400e',
  },

  error: {
    light: '#fecaca',
    main: '#ef4444',
    dark: '#dc2626',
    text: '#7f1d1d',
  },

  info: {
    light: '#dbeafe',
    main: '#3b82f6',
    dark: '#1e40af',
    text: '#1e3a8a',
  },

  // Background Colors
  background: {
    default: '#f0fdf4', // Light emerald tint
    paper: '#ffffff',
    gradient: {
      from: '#f0fdf4', // from-green-50
      via: '#d1fae5', // via-emerald-50
      to: '#ccfbf1', // to-teal-50
    },
  },

  // Surface Colors (for glassmorphism)
  surface: {
    white: 'rgba(255, 255, 255, 0.7)', // white/70
    whiteLight: 'rgba(255, 255, 255, 0.9)', // white/90
    border: 'rgba(255, 255, 255, 0.2)', // white/20
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  // Text Colors
  text: {
    primary: '#1f2937', // gray-800
    secondary: '#4b5563', // gray-600
    tertiary: '#6b7280', // gray-500
    light: '#9ca3af', // gray-400
    white: '#ffffff',
  },

  // Gradient Definitions (matching webapp)
  gradients: {
    primary: ['#10b981', '#0d9488'], // emerald-500 to teal-600
    primaryLight: ['#ecfdf5', '#f0fdfa'], // emerald-50 to teal-50
    accent: ['#f59e0b', '#eab308'], // amber to yellow
    info: ['#dbeafe', '#c7d2fe'], // blue to indigo
    purple: ['#e9d5ff', '#fbcfe8'], // purple to pink
  },

  // Status Colors
  status: {
    online: '#10b981',
    offline: '#9ca3af',
    busy: '#f59e0b',
  },

  // Transparent
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
};

export type ColorPalette = typeof colors;
