/**
 * Spacing System
 * Based on 4px grid system (matching webapp's Tailwind spacing)
 */

export const spacing = {
  xs: 4,      // 0.5rem in Tailwind
  sm: 8,      // 1rem / 2rem in Tailwind
  md: 12,     // 1.5rem in Tailwind
  lg: 16,     // 2rem in Tailwind
  xl: 20,     // 2.5rem in Tailwind
  '2xl': 24,  // 3rem in Tailwind
  '3xl': 32,  // 4rem in Tailwind
  '4xl': 40,  // 5rem in Tailwind
  '5xl': 48,  // 6rem in Tailwind
  '6xl': 64,  // 8rem in Tailwind
} as const;

export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 25},
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 16,
  },
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
