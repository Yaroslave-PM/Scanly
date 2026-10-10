import type { ProductCard } from '@scanly/contracts';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toggleFavorite, useIsFavorite } from '@/features/favorites/store';
import { formatNumber, formatQuantity } from '@/shared/lib/format';
import { colors, radii, sizes, spacing, typography } from '@/shared/theme';
import { Button, Card, Chip, formatPrice, IconButton, Rating, StateView } from '@/shared/ui';
import { useProduct } from './api';
import { PackshotTile } from './PackshotTile';

const TILE_HEIGHT = 340;

export function ProductScreen({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  const { data, error, isPending, refetch } = useProduct(id);
  const favorite = useIsFavorite(id);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (isPending || error) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + spacing.xs, paddingHorizontal: spacing.gutter }]}>
        <IconButton icon="chevron-back" label="Назад" tone="soft" onPress={back} />
        {isPending ? (
          <StateView loading title="Загружаем карточку" />
        ) : (
          <StateView icon="cloud-offline-outline" title="Не удалось загрузить" text={error?.message}>
            <Button title="Повторить" onPress={() => refetch()} />
          </StateView>
        )}
      </View>
    );
  }

  const p = data.product;
  const onFavorite = () =>
    toggleFavorite({
      id: p.id,
      name: p.name,
      brand: p.brand,
      imageUrl: p.imageUrl,
      netQuantity: p.netQuantity,
      unit: p.unit,
      rating: { average: data.rating.average, count: data.rating.count },
    });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: sizes.cta + insets.bottom + spacing.xl }} showsVerticalScrollIndicator={false}>
        <PackshotTile imageUrl={p.imageUrl} height={TILE_HEIGHT} fill={0.62} style={styles.tile} />
        <View style={styles.sheet}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{p.name}</Text>
            <Text style={styles.meta}>{[p.brand, formatQuantity(p.netQuantity, p.unit)].filter(Boolean).join(' · ') || 'Бренд не указан'}</Text>
            <Rating value={data.rating.average} count={data.rating.count} />
          </View>
          <Stats card={data} />
          <Reviews card={data} />
          <Composition card={data} />
          <Text style={styles.attribution}>
            {p.barcode ? `Штрихкод ${p.barcode}. ` : ''}Данные о товаре: Open Food Facts (ODbL) и редакция Scanly.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.topBar, { top: insets.top + spacing.xs }]}>
        <IconButton icon="chevron-back" label="Назад" onPress={back} />
        <IconButton icon={favorite ? 'heart' : 'heart-outline'} label={favorite ? 'Убрать из избранного' : 'В избранное'} onPress={onFavorite} />
      </View>

      <View style={[styles.cta, { bottom: insets.bottom + spacing.md }]}>
        <Button
          size="cta"
          title={data.bestPrice ? 'Сравнить цены' : 'Где купить рядом'}
          onPress={() => router.push({ pathname: '/product/[id]/prices', params: { id } })}
        />
      </View>
    </View>
  );
}

/** Строка из четырёх показателей между тонкими линиями. Нет данных: прочерк, без выдумок. */
function Stats({ card }: { card: ProductCard }) {
  const n = card.nutrition;
  const g = (v: number | null | undefined) => (v == null ? '—' : `${formatNumber(v)} г`);
  const stats = [
    ['Цена от', card.bestPrice ? formatPrice(card.bestPrice.amount, card.bestPrice.currency) : '—'],
    ['Ккал', n?.kcal == null ? '—' : formatNumber(Math.round(n.kcal))],
    ['Белки', g(n?.protein)],
    ['Жиры', g(n?.fat)],
  ];
  return (
    <View style={styles.stats}>
      {stats.map(([label, value]) => (
        <View key={label} style={styles.stat}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function Reviews({ card }: { card: ProductCard }) {
  return (
    <Card tone="muted" style={styles.reviews}>
      <Text style={styles.blockTitle}>Что говорят покупатели</Text>
      {card.rating.count ? (
        <Text style={styles.body}>Отзывы скоро появятся в карточке.</Text>
      ) : (
        <Text style={styles.body}>Отзывов пока нет. Скоро здесь будут оценки покупателей и самые полезные мнения.</Text>
      )}
    </Card>
  );
}

/** Теги аллергенов приходят из Open Food Facts по-английски. */
const ALLERGENS: Record<string, string> = {
  milk: 'молоко',
  gluten: 'глютен',
  soybeans: 'соя',
  nuts: 'орехи',
  peanuts: 'арахис',
  eggs: 'яйца',
  fish: 'рыба',
  crustaceans: 'ракообразные',
  molluscs: 'моллюски',
  celery: 'сельдерей',
  mustard: 'горчица',
  'sesame-seeds': 'кунжут',
  'sulphur-dioxide-and-sulphites': 'сульфиты',
  lupin: 'люпин',
};

const EXTRA = [
  ['carbs', 'Углеводы'],
  ['sugar', 'Сахар'],
  ['fiber', 'Клетчатка'],
  ['salt', 'Соль'],
] as const;

function Composition({ card }: { card: ProductCard }) {
  const { ingredients, allergens, unit } = card.product;
  const n = card.nutrition;
  const per = unit === 'ml' || unit === 'l' ? '100 мл' : '100 г';
  const extra = n ? EXTRA.filter(([key]) => n[key] !== null) : [];
  return (
    <View style={styles.composition}>
      <Text style={styles.blockTitle}>Состав</Text>
      <Text style={ingredients ? styles.body : styles.mutedBody}>{ingredients ?? 'Состав пока не заполнен.'}</Text>
      {allergens.length ? (
        <View style={styles.chips}>
          {allergens.map((a) => (
            <Chip key={a} label={ALLERGENS[a] ?? a} tone="bad" />
          ))}
        </View>
      ) : null}
      {extra.length ? (
        <View style={styles.extra}>
          <Text style={styles.extraTitle}>Ещё на {per}</Text>
          {extra.map(([key, label]) => (
            <View key={key} style={styles.extraRow}>
              <Text style={styles.mutedBody}>{label}</Text>
              <Text style={styles.extraValue}>{formatNumber(n![key]!)} г</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  tile: { width: '100%' },
  topBar: {
    position: 'absolute',
    left: spacing.gutter,
    right: spacing.gutter,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheet: {
    marginTop: -radii.sheet,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.gutter,
    gap: spacing.gutter,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    backgroundColor: colors.surface,
  },
  titleBlock: { gap: 6 },
  title: { ...typography.title, color: colors.ink },
  meta: { ...typography.body, color: colors.muted },
  stats: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  stat: { flex: 1, gap: 4 },
  statLabel: { ...typography.small, fontFamily: 'Onest_400Regular', color: colors.muted },
  statValue: { ...typography.stat, color: colors.ink },
  reviews: { gap: 10 },
  blockTitle: { ...typography.subheading, color: colors.ink },
  body: { ...typography.body, color: colors.ink },
  mutedBody: { ...typography.body, color: colors.muted },
  composition: { gap: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  extra: { marginTop: spacing.xs, gap: spacing.xxs },
  extraTitle: { ...typography.small, color: colors.muted },
  extraRow: { flexDirection: 'row', justifyContent: 'space-between' },
  extraValue: { ...typography.body, fontFamily: 'Onest_600SemiBold', color: colors.ink },
  attribution: { ...typography.small, fontFamily: 'Onest_400Regular', color: colors.muted },
  cta: { position: 'absolute', left: spacing.gutter, right: spacing.gutter },
});
