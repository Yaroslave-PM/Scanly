import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, shadows, sizes } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];
/** Пропсы tabBar берём из самого Tabs: @react-navigation/bottom-tabs не прямая зависимость. */
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

/** Маршруты вкладок по порядку. Скан не вкладка: открывает камеру поверх. */
const ITEMS: Record<string, { label: string; icon: IconName; active: IconName }> = {
  index: { label: 'Главная', icon: 'home-outline', active: 'home' },
  stores: { label: 'Магазины', icon: 'location-outline', active: 'location' },
  'scan-action': { label: 'Сканировать', icon: 'scan-outline', active: 'scan-outline' },
  favorites: { label: 'Избранное', icon: 'heart-outline', active: 'heart' },
};

const NAV_HEIGHT = 68;
const NAV_BOTTOM = 24;
/** Сколько места оставить снизу под плавающее меню. */
export const NAV_SPACE = NAV_HEIGHT + NAV_BOTTOM + 16;

/** Плавающее меню-таблетка: 4 круглые кнопки 52 px, активная залита оливковым. */
export function FloatingNav({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, NAV_BOTTOM) }]}>
      <View style={styles.bar} accessibilityRole="tablist">
        {state.routes.map((route, index) => {
          const item = ITEMS[route.name];
          if (!item) return null;
          const focused = state.index === index;
          const isScan = route.name === 'scan-action';
          const onPress = () => {
            if (isScan) return router.push('/scan');
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          const bg = focused ? colors.primary : isScan ? colors.scan : colors.soft;
          const fg = focused ? colors.white : colors.ink;
          return (
            <Pressable
              key={route.key}
              accessibilityRole={isScan ? 'button' : 'tab'}
              accessibilityLabel={item.label}
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              style={({ pressed }) => [styles.item, { backgroundColor: bg }, pressed && { transform: [{ scale: 0.95 }] }]}
            >
              <Ionicons name={focused ? item.active : item.icon} size={22} color={fg} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bar: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    ...shadows.raised,
  },
  item: { width: sizes.nav, height: sizes.nav, borderRadius: sizes.nav / 2, alignItems: 'center', justifyContent: 'center' },
});
