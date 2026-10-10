import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { colors, gradients } from '@/shared/theme';

interface Props {
  imageUrl: string | null;
  size?: number;
  width?: number;
  height?: number;
  radius?: number;
  /** Доля подложки, которую занимает упаковка. */
  fill?: number;
  style?: ViewStyle;
  children?: ReactNode;
}

/**
 * Упаковка по центру на шалфейной подложке. Фото из Open Food Facts разного качества и на разном фоне,
 * поэтому не растягиваем их на весь блок, а аккуратно вписываем.
 */
export function PackshotTile({ imageUrl, size, width, height, radius = 0, fill = 0.72, style, children }: Props) {
  // Без ширины подложка тянется по родителю (style), упаковку тогда меряем по высоте.
  const h = height ?? size ?? 64;
  const w = width ?? size;
  const inner = Math.min(w ?? h, h) * fill;
  return (
    <LinearGradient {...gradients.tile} style={[styles.tile, { width: w, height: h, borderRadius: radius }, style]}>
      {imageUrl ? (
        <Image source={imageUrl} style={[styles.image, { width: inner, height: inner }]} contentFit="contain" transition={150} />
      ) : (
        <Ionicons name="cube-outline" size={Math.round(inner * 0.5)} color={colors.primary} />
      )}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { borderRadius: 8 },
});
