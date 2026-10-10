import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductSearch } from '@/features/catalog/api';
import { ProductTile } from '@/features/catalog/ProductTile';
import { CITY } from '@/shared/hooks/useLocation';
import { colors, gradients, radii, sizes, spacing, typography } from '@/shared/theme';
import { Button, Card, IconButton, StateView } from '@/shared/ui';
import { NAV_SPACE } from '@/shared/ui/FloatingNav';
import { HERO_PHOTO } from './hero';

const HERO_HEIGHT = 404;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  // Шапка тёмная: пока главная на экране, статус-бар светлый.
  const focused = useIsFocused();
  const popular = useProductSearch('', 10);
  const items = popular.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: NAV_SPACE + insets.bottom }} showsVerticalScrollIndicator={false}>
      {focused ? <StatusBar style="light" /> : null}
      <View style={styles.hero}>
        {HERO_PHOTO ? (
          <>
            <Image source={HERO_PHOTO} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient {...gradients.heroShade} style={StyleSheet.absoluteFill} />
          </>
        ) : (
          <LinearGradient {...gradients.hero} style={StyleSheet.absoluteFill} />
        )}

        <View style={[styles.heroTop, { marginTop: insets.top + spacing.xs }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Профиль" onPress={() => router.push('/profile')} style={styles.avatar}>
            <Text style={styles.avatarText}>Я</Text>
          </Pressable>
          <View style={styles.heroActions}>
            <View style={styles.cityChip}>
              <Ionicons name="location-outline" size={16} color={colors.white} />
              <Text style={styles.cityText}>{CITY.name}</Text>
            </View>
            <IconButton
              icon="notifications-outline"
              label="Уведомления"
              tone="onPhoto"
              onPress={() => Alert.alert('Уведомления', 'Здесь появятся снижения цен на товары из избранного.')}
            />
          </View>
        </View>

        <View style={styles.heroBottom}>
          <View>
            <Text style={styles.sloganLight}>Наведи камеру</Text>
            <Text style={styles.sloganStrong}>и реши за секунду</Text>
          </View>
          <View style={styles.searchRow}>
            <Pressable accessibilityRole="search" onPress={() => router.push('/search')} style={styles.search}>
              <Ionicons name="search" size={20} color={colors.onPhotoMuted} />
              <Text style={styles.searchText}>Найти продукт или бренд</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Сканировать штрихкод"
              onPress={() => router.push('/scan')}
              style={({ pressed }) => [styles.scan, pressed && { opacity: 0.85 }]}
            >
              <Ionicons name="scan-outline" size={24} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Популярное в Ростове</Text>
        <Pressable accessibilityRole="link" onPress={() => router.push('/search')} hitSlop={8}>
          <Text style={styles.link}>Все</Text>
        </Pressable>
      </View>
      {popular.isPending ? (
        <StateView loading title="Загружаем товары" />
      ) : popular.error ? (
        <StateView icon="cloud-offline-outline" title="Нет связи с сервером" text={popular.error.message}>
          <Button title="Повторить" variant="soft" onPress={() => popular.refetch()} />
        </StateView>
      ) : (
        <FlatList
          horizontal
          data={items}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          renderItem={({ item }) => (
            <ProductTile item={item} onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })} />
          )}
        />
      )}

      <Text style={[styles.sectionTitle, styles.sectionPad]}>Выгодно рядом</Text>
      <View style={styles.sectionPad}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/stores')}>
          <Card style={styles.nearby}>
            <View style={styles.nearbyIcon}>
              <Ionicons name="pricetags-outline" size={28} color={colors.primary} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.nearbyTitle}>Скидки рядом появятся скоро</Text>
              <Text style={styles.nearbyText}>Собираем цены в магазинах Ростова. Пока можно посмотреть, что рядом.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Card>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: HERO_HEIGHT,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: {
    width: sizes.icon,
    height: sizes.icon,
    borderRadius: sizes.icon / 2,
    backgroundColor: colors.onPhoto,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Onest_600SemiBold', fontSize: 16, color: colors.white },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cityChip: {
    height: sizes.icon,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.onPhoto,
  },
  cityText: { ...typography.body, fontFamily: 'Onest_500Medium', color: colors.white },
  heroBottom: { gap: spacing.gutter },
  sloganLight: { ...typography.heroLight, color: colors.white },
  sloganStrong: { ...typography.heroStrong, color: colors.white },
  searchRow: { flexDirection: 'row', gap: spacing.xs },
  search: {
    flex: 1,
    height: sizes.field,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    backgroundColor: colors.onPhoto,
  },
  searchText: { fontFamily: 'Onest_400Regular', fontSize: 15, color: colors.onPhotoMuted },
  scan: {
    width: sizes.field,
    height: sizes.field,
    borderRadius: radii.button,
    backgroundColor: colors.onPhotoStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.lg,
    paddingBottom: 14,
  },
  sectionTitle: { ...typography.heading, color: colors.ink },
  sectionPad: { paddingHorizontal: spacing.gutter, paddingTop: spacing.lg, paddingBottom: 14 },
  link: { ...typography.body, fontFamily: 'Onest_500Medium', color: colors.primary },
  carousel: { paddingHorizontal: spacing.gutter, gap: spacing.sm },
  nearby: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm },
  nearbyIcon: {
    width: 64,
    height: 64,
    borderRadius: radii.tile,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyTitle: { ...typography.subheading, color: colors.ink },
  nearbyText: { ...typography.caption, color: colors.muted },
  flex: { flex: 1 },
});
