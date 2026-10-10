import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { makeStyles, radii, sizes, spacing, typography, useTheme, type Colors } from '../theme';

type Variant = 'primary' | 'soft' | 'surface';
type Size = 'cta' | 'regular' | 'small';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: ComponentProps<typeof Ionicons>['name'];
  disabled?: boolean;
}

const variants = (colors: Colors): Record<Variant, { bg: string; fg: string }> => ({
  primary: { bg: colors.primary, fg: colors.onPrimary },
  soft: { bg: colors.soft, fg: colors.ink },
  surface: { bg: colors.surface, fg: colors.ink },
});

const heights: Record<Size, number> = { cta: sizes.cta, regular: 52, small: sizes.icon };

/** Кнопка-таблетка: 60 для главного действия экрана, 52 обычная, 44 мелкая. */
export function Button({ title, onPress, variant = 'primary', size = 'regular', icon, disabled }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const v = variants(colors)[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { height: heights[size], backgroundColor: v.bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
      ]}
    >
      {icon ? <Ionicons name={icon} size={20} color={v.fg} /> : null}
      <Text style={[size === 'small' ? styles.small : styles.label, { color: v.fg }]}>{title}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles(() =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      gap: spacing.xs,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: typography.bodyStrong,
    small: typography.subheading,
  }),
);
