import Ionicons from '@expo/vector-icons/Ionicons';
import type { ProductCard } from '@scanly/contracts';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatNumber, formatQuantity, plural } from '@/shared/lib/format';
import { colors, radii, spacing, typography } from '@/shared/theme';
import { Button, Card, Chip, StateView } from '@/shared/ui';
import { useProduct } from './api';

export function ProductScreen({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  const { data, error, isPending, refetch } = useProduct(id);

  return (
    <View style={styles.screen}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        style={[styles.back, { top: insets.top + spacing.xs }]}
      >
        <Ionicons name="chevron-back" size={24} color={colors.deepGreen} />
      </Pressable>

      {isPending ? (
        <StateView loading title="Загружаем карточку" />
      ) : error ? (
        <StateView icon="cloud-offline-outline" title="Не удалось загрузить" text={error.message}>
          <Button title="Повторить" onPress={() => refetch()} />
        </StateView>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Hero card={data} topInset={insets.top} />
          <View style={styles.sections}>
            <Verdict card={data} />
            <Prices />
            <NutritionBlock card={data} />
            <Composition card={data} />
            <Text style={styles.attribution}>
              Данные о товаре: Open Food Facts и редакция Scanly. Лицензия ODbL.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Hero({ card, topInset }: { card: ProductCard; topInset: number }) {
  const p = card.product;
  const meta = [p.brand, formatQuantity(p.netQuantity, p.unit)].filter(Boolean).join(' · ');
  return (
    <View>
      <View style={[styles.imageWrap, { paddingTop: topInset + spacing.xl }]}>
        {p.imageUrl ? (
          <Image source={p.imageUrl} style={styles.image} contentFit="contain" transition={200} />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Ionicons name="image-outline" size={48} color={colors.muted} />
            <Text style={styles.muted}>Фото пока нет</Text>
          </View>
        )}
      </View>
      <View style={styles.titleBlock}>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        <Text style={styles.title}>{p.name}</Text>
        {p.barcode ? <Text style={styles.barcode}>Штрихкод {p.barcode}</Text> : null}
      </View>
    </View>
  );
}

/** Вердикт по отзывам. Пока отзывов нет, честно об этом говорим, без выдуманных оценок. */
function Verdict({ card }: { card: ProductCard }) {
  const { average, count, distribution } = card.rating;
  if (!count) {
    return (
      <Card>
        <Text style={styles.sectionTitle}>Отзывы</Text>
        <Text style={styles.body}>Пока нет отзывов. Скоро здесь появятся оценки покупателей и самые полезные мнения.</Text>
      </Card>
    );
  }
  const max = Math.max(...distribution, 1);
  return (
    <Card>
      <View style={styles.ratingRow}>
        <Text style={styles.ratingValue}>{average.toFixed(1)}</Text>
        <View style={styles.flex}>
          <Text style={styles.stars}>{'★'.repeat(Math.round(average)).padEnd(5, '☆')}</Text>
          <Text style={styles.muted}>
            {count} {plural(count, ['отзыв', 'отзыва', 'отзывов'])}
          </Text>
        </View>
      </View>
      {[5, 4, 3, 2, 1].map((star) => (
        <View key={star} style={styles.barRow}>
          <Text style={styles.barLabel}>{star}</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${((distribution[star - 1] ?? 0) / max) * 100}%` }]} />
          </View>
        </View>
      ))}
    </Card>
  );
}

function Prices() {
  return (
    <Card>
      <Text style={styles.sectionTitle}>Цены</Text>
      <Text style={styles.body}>Собираем цены в магазинах Ростова-на-Дону. Скоро здесь будет лучшая цена рядом с вами.</Text>
      <View style={styles.gapTop}>
        <Button
          title="Сравнить цены"
          variant="ghost"
          onPress={() => Alert.alert('Скоро', 'Сравнение цен появится в одном из ближайших обновлений.')}
        />
      </View>
    </Card>
  );
}

const NUTRIENTS = [
  ['kcal', 'ккал'],
  ['protein', 'белки'],
  ['fat', 'жиры'],
  ['carbs', 'углеводы'],
] as const;

const EXTRA = [
  ['sugar', 'Сахар'],
  ['fiber', 'Клетчатка'],
  ['salt', 'Соль'],
] as const;

function NutritionBlock({ card }: { card: ProductCard }) {
  const n = card.nutrition;
  const unit = card.product.unit === 'ml' || card.product.unit === 'l' ? '100 мл' : '100 г';
  return (
    <Card>
      <Text style={styles.sectionTitle}>КБЖУ на {unit}</Text>
      {n ? (
        <>
          <View style={styles.tiles}>
            {NUTRIENTS.map(([key, label]) => (
              <View key={key} style={styles.tile}>
                <Text style={styles.tileValue}>{n[key] === null ? '—' : formatNumber(n[key])}</Text>
                <Text style={styles.tileLabel}>{label}</Text>
              </View>
            ))}
          </View>
          {EXTRA.filter(([key]) => n[key] !== null).map(([key, label]) => (
            <View key={key} style={styles.extraRow}>
              <Text style={styles.body}>{label}</Text>
              <Text style={styles.bodyStrong}>{formatNumber(n[key]!)} г</Text>
            </View>
          ))}
        </>
      ) : (
        <Text style={styles.muted}>Производитель не указал или мы ещё не внесли эти данные.</Text>
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

function Composition({ card }: { card: ProductCard }) {
  const { ingredients, allergens } = card.product;
  return (
    <Card>
      <Text style={styles.sectionTitle}>Состав</Text>
      {ingredients ? <Text style={styles.body}>{ingredients}</Text> : <Text style={styles.muted}>Состав пока не заполнен.</Text>}
      {allergens.length ? (
        <View style={styles.gapTop}>
          <Text style={styles.bodyStrong}>Аллергены</Text>
          <View style={styles.chips}>
            {allergens.map((a) => (
              <Chip key={a} label={ALLERGENS[a] ?? a} tone="negative" />
            ))}
          </View>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  back: {
    position: 'absolute',
    left: spacing.sm,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { gap: spacing.sm },
  imageWrap: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingBottom: spacing.md,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  image: { width: 240, height: 240 },
  noImage: { alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  titleBlock: { paddingHorizontal: spacing.sm, paddingTop: spacing.sm, gap: spacing.xxs },
  meta: { ...typography.caption, color: colors.muted },
  title: { ...typography.title, color: colors.deepGreen },
  barcode: { ...typography.caption, color: colors.muted },
  sections: { paddingHorizontal: spacing.sm, gap: spacing.sm },
  sectionTitle: { ...typography.heading, color: colors.deepGreen, marginBottom: spacing.xs },
  body: { ...typography.body, color: colors.deepGreen },
  bodyStrong: { ...typography.bodyStrong, color: colors.deepGreen },
  muted: { ...typography.body, color: colors.muted },
  gapTop: { marginTop: spacing.sm, gap: spacing.xs },
  flex: { flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  ratingValue: { ...typography.display, color: colors.deepGreen },
  stars: { ...typography.heading, color: colors.green },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xxs },
  barLabel: { ...typography.caption, color: colors.muted, width: 12 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.softGreen, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.green },
  tiles: { flexDirection: 'row', gap: spacing.xs },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.softGreen,
  },
  tileValue: { ...typography.bodyStrong, color: colors.deepGreen },
  tileLabel: { ...typography.caption, color: colors.muted },
  extraRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  attribution: { ...typography.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.xs },
});
