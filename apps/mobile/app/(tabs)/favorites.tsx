import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductRow } from '@/features/catalog/ProductRow';
import { useFavorites } from '@/features/favorites/store';
import { colors, spacing, typography } from '@/shared/theme';
import { Button, StateView } from '@/shared/ui';
import { NAV_SPACE } from '@/shared/ui/FloatingNav';

export default function FavoritesTab() {
  const insets = useSafeAreaInsets();
  const items = useFavorites();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.title}>Избранное</Text>
      {items.length ? (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={[styles.list, { paddingBottom: NAV_SPACE + insets.bottom }]}
          renderItem={({ item }) => (
            <ProductRow item={item} onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })} />
          )}
        />
      ) : (
        <StateView
          icon="heart-outline"
          title="Пока пусто"
          text="Нажмите на сердечко в карточке товара, и он появится здесь. Список хранится на этом телефоне."
        >
          <Button title="Сканировать товар" icon="scan-outline" onPress={() => router.push('/scan')} />
        </StateView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.title, color: colors.ink, paddingHorizontal: spacing.gutter, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.md, gap: 10 },
});
