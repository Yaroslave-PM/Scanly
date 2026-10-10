import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductSearch } from '@/features/catalog/api';
import { ProductRow } from '@/features/catalog/ProductRow';
import { makeStyles, spacing, typography, useTheme } from '@/shared/theme';
import { Button, IconButton, SearchField, StateView } from '@/shared/ui';

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
  const { colors } = useTheme();
  const styles = useStyles();
  const [text, setText] = useState('');
  const q = useDebounced(text.trim(), 300);
  const search = useProductSearch(q);
  const items = search.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.xs }]}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" label="Назад" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
        <SearchField value={text} onChangeText={setText} onClear={() => setText('')} autoFocus />
        <IconButton icon="scan-outline" label="Сканировать штрихкод" tone="primary" size={56} radius={20} onPress={() => router.push('/scan')} />
      </View>

      {search.isPending ? (
        <StateView loading title="Ищем" />
      ) : search.error ? (
        <StateView icon="cloud-offline-outline" title="Нет связи с сервером" text={search.error.message}>
          <Button title="Повторить" variant="soft" onPress={() => search.refetch()} />
        </StateView>
      ) : !items.length ? (
        <StateView icon="search-outline" title={`Не нашли «${q}»`} text="Попробуйте другое слово или отсканируйте штрихкод на упаковке.">
          <Button title="Сканировать" icon="scan-outline" onPress={() => router.push('/scan')} />
        </StateView>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          ListHeaderComponent={<Text style={styles.caption}>{q ? 'Результаты' : 'Популярные товары с полной карточкой'}</Text>}
          renderItem={({ item }) => (
            <ProductRow item={item} onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })} />
          )}
          onEndReached={() => search.hasNextPage && !search.isFetchingNextPage && search.fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={search.isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
    list: { paddingHorizontal: spacing.md, gap: 10 },
    caption: { ...typography.caption, color: colors.muted, marginBottom: spacing.xxs, paddingHorizontal: spacing.xxs },
  }),
);
