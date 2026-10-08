import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

type Tone = 'neutral' | 'positive' | 'negative' | 'ad';

const tones: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.softGreen, fg: colors.deepGreen },
  positive: { bg: colors.softGreen, fg: colors.green },
  negative: { bg: '#FBE3E0', fg: colors.red },
  ad: { bg: colors.cream, fg: colors.muted },
};

/** tone="ad" нужен для обязательной пометки рекламы. */
export function Chip({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const t = tones[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }]}>
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'flex-start', borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  label: typography.caption,
});
