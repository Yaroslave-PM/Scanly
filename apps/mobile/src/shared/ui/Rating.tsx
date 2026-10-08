import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export function Rating({ value, count }: { value: number; count: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.value}>★ {value.toFixed(1)}</Text>
      <Text style={styles.count}>{count} отзывов</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  value: { ...typography.bodyStrong, color: colors.deepGreen },
  count: { ...typography.caption, color: colors.muted },
});
