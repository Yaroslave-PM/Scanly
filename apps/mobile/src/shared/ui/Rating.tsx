import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { plural } from '../lib/format';
import { makeStyles, spacing, typography, useTheme } from '../theme';

/** Рейтинг строкой. Без отзывов честно пишем, что их нет, без нулевых звёзд. */
export function Rating({ value, count }: { value: number; count: number }) {
  const { colors } = useTheme();
  const styles = useStyles();
  if (!count) {
    return <Text style={styles.count}>Пока нет отзывов</Text>;
  }
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={16} color={colors.primary} />
      <Text style={styles.value}>{value.toFixed(1).replace('.', ',')}</Text>
      <Text style={styles.count}>
        · {count} {plural(count, ['отзыв', 'отзыва', 'отзывов'])}
      </Text>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
    value: { ...typography.body, fontFamily: 'Onest_600SemiBold', color: colors.ink },
    count: { ...typography.body, color: colors.muted },
  }),
);
