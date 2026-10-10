import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

type Tone = 'neutral' | 'good' | 'bad' | 'ad' | 'primary';

const tones: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.bg, fg: colors.ink },
  good: { bg: colors.bg, fg: colors.good },
  bad: { bg: '#F7E4E1', fg: colors.bad },
  ad: { bg: colors.bg, fg: colors.muted },
  primary: { bg: colors.primary, fg: colors.white },
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
  chip: {
    alignSelf: 'flex-start',
    height: 28,
    justifyContent: 'center',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
  },
  label: { ...typography.small, fontFamily: 'Onest_600SemiBold' },
});
