import type { ProductListItem } from '@scanly/contracts';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatQuantity } from '@/shared/lib/format';
import { colors, radii, spacing, typography } from '@/shared/theme';
import { PackshotTile } from './PackshotTile';

/** Строка товара в поиске и избранном: миниатюра на подложке, название, бренд и вес. */
export function ProductRow({ item, onPress }: { item: ProductListItem; onPress: () => void }) {
  const meta = [item.brand, formatQuantity(item.netQuantity, item.unit)].filter(Boolean).join(' · ');
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <PackshotTile imageUrl={item.imageUrl} size={64} radius={radii.tile} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        {meta ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
  },
  pressed: { opacity: 0.85 },
  body: { flex: 1, gap: 2 },
  name: { ...typography.subheading, color: colors.ink },
  meta: { ...typography.caption, color: colors.muted },
});
