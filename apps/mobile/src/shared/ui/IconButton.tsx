import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, sizes } from '../theme';

type Tone = 'surface' | 'onPhoto' | 'soft' | 'primary';

const tones: Record<Tone, { bg: string; fg: string }> = {
  surface: { bg: colors.surface, fg: colors.ink },
  onPhoto: { bg: colors.onPhoto, fg: colors.white },
  soft: { bg: colors.soft, fg: colors.ink },
  primary: { bg: colors.primary, fg: colors.white },
};

interface Props {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress?: () => void;
  tone?: Tone;
  size?: number;
  radius?: number;
}

/** Круглая кнопка с иконкой: «назад», «в избранное», «моё место». */
export function IconButton({ icon, label, onPress, tone = 'surface', size = sizes.icon, radius }: Props) {
  const t = tones[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: radius ?? size / 2, backgroundColor: t.bg, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Ionicons name={icon} size={Math.round(size * 0.45)} color={t.fg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({ base: { alignItems: 'center', justifyContent: 'center' } });
