/** Единственный источник правды по дизайну. Сетка 8pt, шрифт Inter. */

export const colors = {
  lime: '#D8FF4F',
  deepGreen: '#071304',
  deepGreen2: '#10220A',
  cream: '#F5F5EE',
  white: '#FFFFFF',
  muted: '#777B72',
  green: '#4F7F20',
  softGreen: '#EEF6D5',
  red: '#E85A4F',
  blue: '#4A90E2',
} as const;

const unit = 8;
export const spacing = {
  xxs: unit / 2, // 4
  xs: unit, // 8
  sm: unit * 2, // 16
  md: unit * 3, // 24
  lg: unit * 4, // 32
  xl: unit * 6, // 48
  xxl: unit * 8, // 64
} as const;

export const radii = { sm: 12, md: 16, lg: 24, xl: 32, pill: 999 } as const;

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  display: { fontFamily: fontFamily.bold, fontSize: 40, lineHeight: 48, letterSpacing: -1 },
  title: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 32, letterSpacing: -0.5 },
  heading: { fontFamily: fontFamily.semibold, fontSize: 20, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 16 },
} as const;

/** Аккуратные тени без свечения. */
export const shadows = {
  card: { shadowColor: colors.deepGreen, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  raised: { shadowColor: colors.deepGreen, shadowOpacity: 0.14, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
} as const;

export const theme = { colors, spacing, radii, typography, shadows, fontFamily } as const;
export type Theme = typeof theme;
