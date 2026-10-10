import type { ProductListItem } from '@scanly/contracts';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatQuantity } from '@/shared/lib/format';
import { colors, radii, spacing, typography } from '@/shared/theme';

/** Строка товара в поиске и подборках: фото, название, бренд и вес, рейтинг. */
export function ProductRow({ item, onPress }: { item: ProductListItem; onPress: () => void }) {
  const meta = [item.brand, formatQuantity(item.netQuantity, item.unit)].filter(Boolean).join(' · ');
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.thumb}>
        {item.imageUrl ? (
          <Image source={item.imageUrl} style={styles.image} contentFit="contain" transition={150} />
        ) : (
          <Text style={styles.noImage}>нет фото</Text>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        {meta ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
        <Text style={styles.rating}>
          {item.rating.count ? `★ ${item.rating.average.toFixed(1)} · ${item.rating.count}` : 'Пока без отзывов'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.md,
  },
  pressed: { opacity: 0.85 },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radii.sm,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: 64, height: 64 },
  noImage: { ...typography.caption, color: colors.muted },
  body: { flex: 1, gap: spacing.xxs, justifyContent: 'center' },
  name: { ...typography.bodyStrong, color: colors.deepGreen },
  meta: { ...typography.caption, color: colors.muted },
  rating: { ...typography.caption, color: colors.green },
});
