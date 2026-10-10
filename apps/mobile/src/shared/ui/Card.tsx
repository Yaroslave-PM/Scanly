import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { makeStyles, radii, spacing } from '../theme';

type Tone = 'surface' | 'muted';

/** Карточка с радиусом 24: белая на фоне экрана или шалфейная на белом шите. */
export function Card({ children, style, tone = 'surface' }: PropsWithChildren<{ style?: ViewStyle; tone?: Tone }>) {
  const styles = useStyles();
  return <View style={[styles.card, tone === 'muted' && styles.muted, style]}>{children}</View>;
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    card: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md },
    muted: { backgroundColor: colors.bg },
  }),
);
