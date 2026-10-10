import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View, type ColorValue } from 'react-native';
import { colors, shadows, typography } from '@/shared/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const icon =
  (name: IconName, active: IconName) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? active : name} size={24} color={color} />
  );

/** Центральная кнопка скана: главное действие приложения, поэтому крупнее остальных и всегда под пальцем. */
function ScanButton() {
  return (
    <View style={styles.scanSlot}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Сканировать штрихкод"
        onPress={() => router.push('/scan')}
        style={({ pressed }) => [styles.scanButton, pressed && { transform: [{ scale: 0.96 }] }]}
      >
        <Ionicons name="barcode-outline" size={32} color={colors.deepGreen} />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.deepGreen,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: typography.caption,
        tabBarStyle: styles.bar,
        sceneStyle: { backgroundColor: colors.cream },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Главная', tabBarIcon: icon('home-outline', 'home') }} />
      <Tabs.Screen name="search" options={{ title: 'Поиск', tabBarIcon: icon('search-outline', 'search') }} />
      <Tabs.Screen name="scan-action" options={{ title: '', tabBarButton: () => <ScanButton /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Избранное', tabBarIcon: icon('heart-outline', 'heart') }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль', tabBarIcon: icon('person-outline', 'person') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.white, borderTopWidth: 0, paddingTop: 8 },
  scanSlot: { flex: 1, alignItems: 'center' },
  scanButton: {
    marginTop: -24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    ...shadows.raised,
  },
});
