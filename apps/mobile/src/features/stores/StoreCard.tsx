import type { NearbyStore } from '@scanly/contracts';
import { StyleSheet, Text, View } from 'react-native';
import { formatDistance } from '@/shared/lib/format';
import { makeStyles, radii, spacing, typography } from '@/shared/theme';

interface Props {
  store: NearbyStore;
  price?: string;
  updated?: string;
  best?: boolean;
}

/** Магазин в списке: буква сети на плашке, адрес и расстояние, цена справа, если она известна. */
export function StoreCard({ store, price, updated, best }: Props) {
  const styles = useStyles();
  const title = store.chain ?? store.name;
  return (
    <View style={styles.card}>
      <View style={styles.logo}>
        <Text style={styles.letter}>{title.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {best ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Дешевле всех</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.muted} numberOfLines={1}>
          {store.address ?? (store.chain ? store.name : 'Адрес уточняется')}
        </Text>
        <Text style={styles.small}>
          {formatDistance(store.distanceM)}
          {updated ? ` · обновлено ${updated}` : ''}
        </Text>
      </View>
      {price ? <Text style={styles.price}>{price}</Text> : null}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.sm,
      borderRadius: radii.card,
      backgroundColor: colors.surface,
    },
    logo: {
      width: 56,
      height: 56,
      borderRadius: radii.tile,
      backgroundColor: colors.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    letter: { fontFamily: 'Onest_700Bold', fontSize: 20, color: colors.good },
    body: { flex: 1, minWidth: 0, gap: 2 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    title: { ...typography.subheading, color: colors.ink, flexShrink: 1 },
    badge: { height: 22, paddingHorizontal: spacing.xs, borderRadius: 11, backgroundColor: colors.primary, justifyContent: 'center' },
    badgeText: { fontFamily: 'Onest_700Bold', fontSize: 11, color: colors.onPrimary },
    muted: { ...typography.caption, color: colors.muted },
    small: { ...typography.small, fontFamily: 'Onest_400Regular', color: colors.muted },
    price: { ...typography.price, color: colors.ink },
  }),
);
