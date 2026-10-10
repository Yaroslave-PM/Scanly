import {
  Onest_300Light,
  Onest_400Regular,
  Onest_500Medium,
  Onest_600SemiBold,
  Onest_700Bold,
  useFonts,
} from '@expo-google-fonts/onest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useTheme } from '@/shared/theme';

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  const [loaded] = useFonts({ Onest_300Light, Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold });
  // Карточки товаров меняются редко: держим их свежими 5 минут, в магазине со слабой связью это важно.
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60_000, retry: 1 } } }),
  );
  if (!loaded) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="search" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="product/[id]/index" />
        <Stack.Screen name="product/[id]/prices" />
      </Stack>
    </QueryClientProvider>
  );
}
