import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { makeStyles, radii, spacing, typography, useTheme } from '../theme';

interface Props {
  icon?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  title: string;
  text?: string;
  children?: ReactNode;
}

/** Пустые состояния, ошибки и загрузка: везде одинаково, по центру. */
export function StateView({ icon, loading, title, text, children }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.wrap}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : icon ? (
        <View style={styles.icon}>
          <Ionicons name={icon} size={30} color={colors.primary} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {text ? <Text style={styles.text}>{text}</Text> : null}
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.xs },
    icon: {
      width: 64,
      height: 64,
      borderRadius: radii.pill,
      backgroundColor: colors.soft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    title: { ...typography.heading, color: colors.ink, textAlign: 'center' },
    text: { ...typography.body, color: colors.muted, textAlign: 'center' },
    actions: { alignSelf: 'stretch', gap: spacing.xs, marginTop: spacing.md },
  }),
);
