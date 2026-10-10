import { Tabs } from 'expo-router';
import { colors } from '@/shared/theme';
import { FloatingNav } from '@/shared/ui/FloatingNav';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingNav {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="stores" />
      <Tabs.Screen name="scan-action" />
      <Tabs.Screen name="favorites" />
    </Tabs>
  );
}
