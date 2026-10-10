import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Props {
  icon?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  title: string;
  text?: string;
  children?: ReactNode;
}

/** Пустые состояния, ошибки и загрузка: везде одинаково, по центру. */
export function StateView({ icon, loading, title, text, children }: Props) {
  return (
    <View style={styles.wrap}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.green} />
      ) : icon ? (
        <View style={styles.icon}>
          <Ionicons name={icon} size={32} color={colors.deepGreen} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {text ? <Text style={styles.text}>{text}</Text> : null}
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.xs },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: { ...typography.heading, color: colors.deepGreen, textAlign: 'center' },
  text: { ...typography.body, color: colors.muted, textAlign: 'center' },
  actions: { alignSelf: 'stretch', gap: spacing.xs, marginTop: spacing.sm },
});
