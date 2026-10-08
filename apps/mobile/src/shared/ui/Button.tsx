import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

type Variant = 'primary' | 'dark' | 'ghost';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
}

const variants: Record<Variant, { bg: string; fg: string }> = {
  primary: { bg: colors.lime, fg: colors.deepGreen },
  dark: { bg: colors.deepGreen, fg: colors.white },
  ghost: { bg: colors.softGreen, fg: colors.deepGreen },
};

/** Крупная кнопка (высота 56 = 7 * 8pt), под большой палец. */
export function Button({ title, onPress, variant = 'primary', disabled }: Props) {
  const v = variants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.base, { backgroundColor: v.bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 }]}
    >
      <Text style={[styles.label, { color: v.fg }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 56, borderRadius: radii.pill, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center' },
  label: typography.bodyStrong,
});
