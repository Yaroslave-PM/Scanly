/** Единственный источник правды по дизайну. Вариант «Олива», сетка 8pt, шрифт Onest. */

export type ColorScheme = 'light' | 'dark';

const light = {
  /** Фон экранов. */
  bg: '#EEF2E6',
  surface: '#FFFFFF',
  /** Мягкие плашки, неактивные кнопки меню, иконки сетей. */
  soft: '#E1EACF',
  ink: '#1F2A14',
  muted: '#5E6855',
  line: '#E4EADA',
  /** Основной оливковый: кнопки, активная иконка, ссылки. */
  primary: '#4A6B1F',
  /** Текст и иконки на основном цвете. */
  onPrimary: '#FFFFFF',
  /** Кнопка скана в меню. */
  scan: '#C7DA9F',
  /** Плашка «лучшей цены» и текст на ней. */
  best: '#1F2A14',
  onBest: '#FFFFFF',
  good: '#3F5E17',
  bad: '#B5473D',
  badSoft: '#F7E4E1',
  me: '#4A90E2',
  white: '#FFFFFF',
  /** Фон камеры сканера, одинаковый в обеих темах. */
  camera: '#0B0F08',
  /** Плашки поверх шапки: белый 20%, без размытия. */
  onPhoto: 'rgba(255, 255, 255, 0.20)',
  onPhotoStrong: 'rgba(255, 255, 255, 0.26)',
  onPhotoMuted: 'rgba(255, 255, 255, 0.82)',
};

export type Colors = { [K in keyof typeof light]: string };

/** Тёмная тема: та же олива, но фон почти чёрный с зелёным оттенком, акцент светлее ради контраста. */
const dark: Colors = {
  bg: '#11150D',
  surface: '#1B2115',
  soft: '#283120',
  ink: '#ECF1E3',
  muted: '#9CA690',
  line: '#2A3322',
  primary: '#A6CB63',
  onPrimary: '#14200A',
  scan: '#3B4C24',
  best: '#E1EACF',
  onBest: '#1F2A14',
  good: '#A6CB63',
  bad: '#E58A7F',
  badSoft: '#3A211D',
  me: '#5AA0F0',
  white: '#FFFFFF',
  camera: '#0B0F08',
  onPhoto: 'rgba(255, 255, 255, 0.16)',
  onPhotoStrong: 'rgba(255, 255, 255, 0.22)',
  onPhotoMuted: 'rgba(255, 255, 255, 0.80)',
};

export const palettes: Record<ColorScheme, Colors> = { light, dark };

interface Gradient {
  colors: readonly [string, string, ...string[]];
  locations: readonly [number, number, ...number[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export interface Gradients {
  /** Шапка главной. Приближение radial 120%×90% at 85% 5%. */
  hero: Gradient;
  /** Подложка упаковки товара: linear 160deg. */
  tile: Gradient;
}

const heroGeometry = { locations: [0, 0.42, 1] as const, start: { x: 0.85, y: 0.05 }, end: { x: 0.15, y: 1 } };
const tileGeometry = { locations: [0, 1] as const, start: { x: 0.33, y: 0 }, end: { x: 0.67, y: 1 } };

/** Градиенты в формате expo-linear-gradient. */
export const gradientSets: Record<ColorScheme, Gradients> = {
  light: {
    hero: { colors: ['#7FA043', '#4A6B1F', '#2A4211'], ...heroGeometry },
    tile: { colors: ['#E3ECD0', '#CADBA9'], ...tileGeometry },
  },
  dark: {
    hero: { colors: ['#5B7A2C', '#33501A', '#152309'], ...heroGeometry },
    tile: { colors: ['#273120', '#1D2617'], ...tileGeometry },
  },
};

const unit = 8;
export const spacing = {
  xxs: unit / 2, // 4
  xs: unit, // 8
  sm: unit * 1.5, // 12
  md: unit * 2, // 16
  gutter: 20,
  lg: unit * 3, // 24
  xl: unit * 4, // 32
  xxl: unit * 7, // 56
} as const;

export const radii = { sm: 12, tile: 18, button: 20, card: 24, sheet: 32, hero: 36, pill: 999 } as const;

/** Высоты кнопок: 44 круглые, 56 поиск и скан, 60 главная кнопка. */
export const sizes = { icon: 44, nav: 52, field: 56, cta: 60 } as const;

export const fontFamily = {
  light: 'Onest_300Light',
  regular: 'Onest_400Regular',
  medium: 'Onest_500Medium',
  semibold: 'Onest_600SemiBold',
  bold: 'Onest_700Bold',
} as const;

export const typography = {
  heroLight: { fontFamily: fontFamily.light, fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  heroStrong: { fontFamily: fontFamily.medium, fontSize: 40, lineHeight: 44, letterSpacing: -1 },
  title: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  heading: { fontFamily: fontFamily.semibold, fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  subheading: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 22 },
  stat: { fontFamily: fontFamily.bold, fontSize: 17, lineHeight: 22 },
  price: { fontFamily: fontFamily.bold, fontSize: 18, lineHeight: 22 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  small: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },
} as const;

/** Аккуратные тени без свечения. */
export const shadows = {
  card: { shadowColor: '#071304', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  raised: { shadowColor: '#071304', shadowOpacity: 0.12, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
} as const;

