import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  gradientSets,
  palettes,
  type ColorScheme,
  type Colors,
  type Gradients,
} from '@scanly/design-tokens';
import { useSyncExternalStore } from 'react';
import { useColorScheme } from 'react-native';

export { spacing, radii, sizes, typography, shadows, fontFamily } from '@scanly/design-tokens';
export type { ColorScheme, Colors, Gradients } from '@scanly/design-tokens';

export interface AppTheme {
  scheme: ColorScheme;
  isDark: boolean;
  colors: Colors;
  gradients: Gradients;
}

const themes: Record<ColorScheme, AppTheme> = {
  light: { scheme: 'light', isDark: false, colors: palettes.light, gradients: gradientSets.light },
  dark: { scheme: 'dark', isDark: true, colors: palettes.dark, gradients: gradientSets.dark },
};

/** «Как в телефоне» или принудительно светлая/тёмная. Выбор хранится на устройстве. */
export type ThemePreference = 'system' | ColorScheme;

const KEY = 'theme:v1';
let preference: ThemePreference = 'system';
let loaded = false;
const listeners = new Set<() => void>();

async function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      preference = raw;
      listeners.forEach((l) => l());
    }
  } catch {
    // Не прочитали настройку: остаёмся на системной теме.
  }
}

function subscribe(listener: () => void) {
  void load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setThemePreference(next: ThemePreference) {
  preference = next;
  listeners.forEach((l) => l());
  void AsyncStorage.setItem(KEY, next).catch(() => undefined);
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, () => preference);
}

export function useTheme(): AppTheme {
  const system = useColorScheme();
  const pref = useThemePreference();
  return themes[pref === 'system' ? (system === 'dark' ? 'dark' : 'light') : pref];
}

/**
 * Стили, зависящие от темы. Пишутся как раньше через StyleSheet.create, только внутри фабрики:
 * `const useStyles = makeStyles(({ colors }) => StyleSheet.create({ ... }))`, в компоненте `const styles = useStyles()`.
 * Для каждой темы стили создаются один раз.
 */
export function makeStyles<T>(factory: (theme: AppTheme) => T): () => T {
  const cache = new Map<ColorScheme, T>();
  return function useStyles() {
    const theme = useTheme();
    let styles = cache.get(theme.scheme);
    if (!styles) {
      styles = factory(theme);
      cache.set(theme.scheme, styles);
    }
    return styles;
  };
}
