import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductSearch } from '@/features/catalog/api';
import { ProductRow } from '@/features/catalog/ProductRow';
import { colors, spacing, typography } from '@/shared/theme';
import { Button, SearchField, StateView } from '@/shared/ui';

function useDebounced(value: string, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const q = useDebounced(text.trim(), 300);
  const search = useProductSearch(q);
  const items = search.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Поиск</Text>
        <SearchField value={text} onChangeText={setText} onClear={() => setText('')} autoFocus />
      </View>

      {search.isPending ? (
        <StateView loading title="Ищем" />
      ) : search.error ? (
        <StateView icon="cloud-offline-outline" title="Нет связи с сервером" text={search.error.message}>
          <Button title="Повторить" variant="ghost" onPress={() => search.refetch()} />
        </StateView>
      ) : !items.length ? (
        <StateView
          icon="search-outline"
          title={`Не нашли «${q}»`}
          text="Попробуйте другое слово или отсканируйте штрихкод на упаковке."
        >
          <Button title="Сканировать" onPress={() => router.push('/scan')} />
        </StateView>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          ListHeaderComponent={
            q ? null : <Text style={styles.caption}>Популярные товары. Начните вводить название или бренд.</Text>
          }
          renderItem={({ item }) => (
            <ProductRow
              item={item}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            />
          )}
          onEndReached={() => search.hasNextPage && !search.isFetchingNextPage && search.fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={search.isFetchingNextPage ? <ActivityIndicator color={colors.green} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: spacing.sm, gap: spacing.sm, paddingBottom: spacing.sm },
  title: { ...typography.title, color: colors.deepGreen },
  list: { paddingHorizontal: spacing.sm, paddingBottom: spacing.xl, gap: spacing.xs },
  caption: { ...typography.caption, color: colors.muted, marginBottom: spacing.xs },
});
