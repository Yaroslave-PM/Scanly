import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductSearch } from '@/features/catalog/api';
import { ProductRow } from '@/features/catalog/ProductRow';
import { colors, radii, spacing, typography } from '@/shared/theme';
import { Button, StateView } from '@/shared/ui';

/** Главная для демо: сканер, поиск и товары с полной карточкой. Подборки «рядом» и «скидки» появятся с ценами. */
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const popular = useProductSearch('', 10);
  const items = popular.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.logo}>Scanly</Text>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Наведи камеру и пойми, брать или нет</Text>
        <Text style={styles.heroText}>Состав, КБЖУ и отзывы по штрихкоду за пару секунд.</Text>
        <Button title="Сканировать товар" onPress={() => router.push('/scan')} />
      </View>

      <Pressable accessibilityRole="search" onPress={() => router.push('/search')} style={styles.fakeSearch}>
        <Ionicons name="search" size={20} color={colors.muted} />
        <Text style={styles.fakeSearchText}>Найти товар по названию</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Популярное с полной карточкой</Text>
      {popular.isPending ? (
        <StateView loading title="Загружаем товары" />
      ) : popular.error ? (
        <StateView icon="cloud-offline-outline" title="Нет связи с сервером" text={popular.error.message}>
          <Button title="Повторить" variant="ghost" onPress={() => popular.refetch()} />
        </StateView>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <ProductRow
              key={item.id}
              item={item}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.sm, paddingBottom: spacing.xl, gap: spacing.sm },
  logo: { ...typography.title, color: colors.deepGreen },
  hero: { backgroundColor: colors.deepGreen, borderRadius: radii.lg, padding: spacing.md, gap: spacing.sm },
  heroTitle: { ...typography.title, color: colors.white },
  heroText: { ...typography.body, color: colors.softGreen },
  fakeSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 48,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
  },
  fakeSearchText: { ...typography.body, color: colors.muted },
  sectionTitle: { ...typography.heading, color: colors.deepGreen, marginTop: spacing.xs },
  list: { gap: spacing.xs },
});
