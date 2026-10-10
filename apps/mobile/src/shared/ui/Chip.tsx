import { StyleSheet, Text, View } from 'react-native';
import { makeStyles, radii, spacing, typography, useTheme, type Colors } from '../theme';

type Tone = 'neutral' | 'good' | 'bad' | 'ad' | 'primary';

const tones = (colors: Colors): Record<Tone, { bg: string; fg: string }> => ({
  neutral: { bg: colors.bg, fg: colors.ink },
  good: { bg: colors.bg, fg: colors.good },
  bad: { bg: colors.badSoft, fg: colors.bad },
  ad: { bg: colors.bg, fg: colors.muted },
  primary: { bg: colors.primary, fg: colors.onPrimary },
});

/** tone="ad" нужен для обязательной пометки рекламы. */
export function Chip({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const { colors } = useTheme();
  const styles = useStyles();
  const t = tones(colors)[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }]}>
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const useStyles = makeStyles(() =>
  StyleSheet.create({
    chip: {
      alignSelf: 'flex-start',
      height: 28,
      justifyContent: 'center',
      borderRadius: radii.pill,
      paddingHorizontal: spacing.sm,
    },
    label: { ...typography.small, fontFamily: 'Onest_600SemiBold' },
  }),
);
