import Ionicons from '@expo/vector-icons/Ionicons';
import type { ProductListItem } from '@scanly/contracts';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatQuantity } from '@/shared/lib/format';
import { makeStyles, radii, typography, useTheme } from '@/shared/theme';
import { PackshotTile } from './PackshotTile';

export const TILE_WIDTH = 140;

/** Карточка карусели на главной: подложка 140×156, рейтинг в углу, название и вес снизу. */
export function ProductTile({ item, onPress }: { item: ProductListItem; onPress: () => void }) {
  const { colors } = useTheme();
  const styles = useStyles();
  const meta = [item.brand, formatQuantity(item.netQuantity, item.unit)].filter(Boolean).join(' · ');
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      <PackshotTile imageUrl={item.imageUrl} width={TILE_WIDTH} height={156} radius={radii.card} fill={0.68}>
        {item.rating.count ? (
          <View style={styles.badge}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <Text style={styles.badgeText}>{item.rating.average.toFixed(1).replace('.', ',')}</Text>
          </View>
        ) : null}
      </PackshotTile>
      <View>
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

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    card: { width: TILE_WIDTH, gap: 10 },
    badge: {
      position: 'absolute',
      left: 10,
      top: 10,
      height: 26,
      paddingHorizontal: 10,
      borderRadius: 13,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    badgeText: { fontFamily: 'Onest_600SemiBold', fontSize: 12, color: colors.ink },
    name: { ...typography.subheading, color: colors.ink },
    meta: { ...typography.caption, color: colors.muted, marginTop: 2 },
  }),
);
