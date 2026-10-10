import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, spacing, typography } from '@/shared/theme';
import { Card, IconButton } from '@/shared/ui';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.xs }]}>
      <IconButton icon="chevron-back" label="Назад" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Я</Text>
        </View>
        <Text style={styles.title}>Профиль</Text>
        <Text style={styles.muted}>
          Вход по почте, VK ID и Яндекс ID появится в следующем обновлении. Тогда избранное и отзывы будут с вами на любом телефоне.
        </Text>
      </View>
      <Card>
        <Text style={styles.cardTitle}>О данных</Text>
        <Text style={styles.muted}>
          Карточки товаров частично из Open Food Facts, магазины из OpenStreetMap. Обе базы распространяются по лицензии ODbL.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.gutter, gap: spacing.lg },
  head: { alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarText: { fontFamily: 'Onest_600SemiBold', fontSize: 32, color: colors.white },
  title: { ...typography.title, color: colors.ink },
  cardTitle: { ...typography.subheading, color: colors.ink, marginBottom: spacing.xxs },
  muted: { ...typography.body, color: colors.muted, textAlign: 'left' },
});
