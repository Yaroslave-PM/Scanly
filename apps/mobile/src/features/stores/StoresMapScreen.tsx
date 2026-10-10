import Ionicons from '@expo/vector-icons/Ionicons';
import type { NearbyStore, PriceOffer } from '@scanly/contracts';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CITY, useLocation, type Point } from '@/shared/hooks/useLocation';
import { formatUpdated, plural } from '@/shared/lib/format';
import { colors, radii, sizes, spacing, typography } from '@/shared/theme';
import { Card, formatPrice, IconButton, StateView } from '@/shared/ui';
import { useNearbyStores, useProductPrices } from './api';
import { StoreCard } from './StoreCard';

interface Props {
  /** Есть товар: экран сравнения цен. Нет: просто магазины рядом. */
  product?: { id: string; name: string };
  /** Отступ снизу под плавающее меню на вкладке. */
  bottomInset?: number;
}

const regionAround = (p: Point): Region => ({ latitude: p.lat, longitude: p.lng, latitudeDelta: 0.025, longitudeDelta: 0.025 });

export function StoresMapScreen({ product, bottomInset = 0 }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const location = useLocation();
  const point = location.status === 'ready' ? location.point : null;
  const [sort, setSort] = useState<'price' | 'distance'>('price');
  const map = useRef<MapView>(null);

  const stores = useNearbyStores(point);
  const prices = useProductPrices(product?.id ?? '', product ? point : null, sort);
  const offers = prices.data?.items ?? [];
  const hasPrices = offers.length > 0;
  const bestId = hasPrices ? offers.reduce((a, b) => (b.amount < a.amount ? b : a)).id : null;
  const address = useAddress(location.status === 'ready' && location.source === 'device' ? point : null);

  const mapHeight = Math.round(height * 0.5);
  const pins = useMemo(
    () =>
      hasPrices
        ? offers.map((o) => ({ key: o.id, store: o.store, label: formatPrice(o.amount, o.currency), best: o.id === bestId }))
        : (stores.data?.items ?? []).slice(0, 20).map((s) => ({ key: s.id, store: s, label: (s.chain ?? s.name).charAt(0).toUpperCase(), best: false })),
    [hasPrices, offers, bestId, stores.data],
  );

  const count = hasPrices ? offers.length : (stores.data?.items.length ?? 0);
  const title = product
    ? `${product.name} · ${count} ${plural(count, ['магазин', 'магазина', 'магазинов'])}`
    : `Магазины рядом · ${count}`;

  return (
    <View style={styles.screen}>
      <View style={{ height: mapHeight }}>
        {point ? (
          <MapView
            ref={map}
            style={StyleSheet.absoluteFill}
            initialRegion={regionAround(point)}
            showsUserLocation={location.status === 'ready' && location.source === 'device'}
            showsMyLocationButton={false}
            showsPointsOfInterests={false}
            toolbarEnabled={false}
          >
            {pins.map((p) => (
              <Marker key={p.key} coordinate={{ latitude: p.store.lat, longitude: p.store.lng }} tracksViewChanges={false}>
                <View style={[styles.pin, p.best && styles.pinBest]}>
                  <Text style={[styles.pinText, p.best && styles.pinTextBest]}>{p.label}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.mapPlaceholder]} />
        )}

        <View style={[styles.topBar, { top: insets.top + spacing.xs }]}>
          {product ? (
            <IconButton icon="chevron-back" label="Назад" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
          ) : (
            <View style={styles.cityChip}>
              <Ionicons name="location-outline" size={16} color={colors.ink} />
              <Text style={styles.cityText}>{CITY.name}</Text>
            </View>
          )}
          {product && hasPrices ? <Segment value={sort} onChange={setSort} /> : null}
          <IconButton
            icon="locate-outline"
            label="Моё местоположение"
            onPress={() => point && map.current?.animateToRegion(regionAround(point), 400)}
          />
        </View>

        <View style={[styles.addressPill, { bottom: radii.sheet + spacing.sm }]}>
          <Ionicons name="location-outline" size={18} color={colors.ink} />
          <Text style={styles.addressText} numberOfLines={1}>
            {location.status !== 'ready'
              ? 'Определяем, где вы'
              : location.source === 'city'
                ? `Центр города · ${location.reason === 'far' ? 'вы не в Ростове' : 'геолокация выключена'}`
                : (address ?? 'Вы здесь')}
          </Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.sheetTitle} numberOfLines={1}>
          {title}
        </Text>
        <ScrollView contentContainerStyle={[styles.list, { paddingBottom: bottomInset + insets.bottom + spacing.lg }]}>
          {product && !prices.isPending && !hasPrices ? (
            <Card style={styles.notice}>
              <Text style={styles.noticeTitle}>Цен на этот товар пока нет</Text>
              <Text style={styles.noticeText}>
                Мы только начали собирать цены в Ростове. Ниже магазины рядом, где он может продаваться.
              </Text>
            </Card>
          ) : null}

          {stores.isPending || location.status === 'loading' ? (
            <StateView loading title="Ищем магазины рядом" />
          ) : stores.error ? (
            <StateView icon="cloud-offline-outline" title="Нет связи с сервером" text={stores.error.message} />
          ) : hasPrices ? (
            offers.map((o: PriceOffer) => (
              <StoreCard
                key={o.id}
                store={o.store}
                price={formatPrice(o.amount, o.currency)}
                updated={formatUpdated(o.observedAt)}
                best={o.id === bestId}
              />
            ))
          ) : stores.data?.items.length ? (
            stores.data.items.map((s: NearbyStore) => <StoreCard key={s.id} store={s} />)
          ) : (
            <StateView icon="storefront-outline" title="Рядом магазинов не нашли" text="Попробуйте отойти чуть дальше от окраины." />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function Segment({ value, onChange }: { value: 'price' | 'distance'; onChange: (v: 'price' | 'distance') => void }) {
  const options = [
    ['price', 'Дешевле'],
    ['distance', 'Ближе'],
  ] as const;
  return (
    <View style={styles.segment} accessibilityRole="tablist">
      {options.map(([key, label]) => (
        <Pressable
          key={key}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === key }}
          onPress={() => onChange(key)}
          style={[styles.segmentItem, value === key && styles.segmentOn]}
        >
          <Text style={[styles.segmentText, value === key && styles.segmentTextOn]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

/** Адрес точки для плашки над списком: «Большая Садовая, 50». */
function useAddress(point: Point | null) {
  const [address, setAddress] = useState<string | null>(null);
  useEffect(() => {
    if (!point) return;
    let cancelled = false;
    Location.reverseGeocodeAsync({ latitude: point.lat, longitude: point.lng })
      .then(([a]) => {
        if (cancelled || !a) return;
        const street = [a.street, a.streetNumber].filter(Boolean).join(', ');
        setAddress(street || a.name || a.district || null);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [point]);
  return address;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  mapPlaceholder: { backgroundColor: colors.soft },
  topBar: {
    position: 'absolute',
    left: spacing.gutter,
    right: spacing.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityChip: {
    height: sizes.icon,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  cityText: { ...typography.body, fontFamily: 'Onest_500Medium', color: colors.ink },
  segment: { height: sizes.icon, flexDirection: 'row', padding: 4, gap: 4, borderRadius: radii.pill, backgroundColor: colors.surface },
  segmentItem: { height: 36, paddingHorizontal: spacing.md, borderRadius: 18, justifyContent: 'center' },
  segmentOn: { backgroundColor: colors.primary },
  segmentText: { ...typography.body, fontFamily: 'Onest_500Medium', color: colors.ink },
  segmentTextOn: { fontFamily: 'Onest_600SemiBold', color: colors.white },
  pin: {
    height: 32,
    minWidth: 32,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  pinBest: { backgroundColor: colors.best, borderColor: colors.best },
  pinText: { fontFamily: 'Onest_600SemiBold', fontSize: 14, color: colors.ink },
  pinTextBest: { fontFamily: 'Onest_700Bold', color: colors.white },
  addressPill: {
    position: 'absolute',
    left: spacing.gutter,
    right: spacing.gutter,
    height: sizes.field,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  addressText: { ...typography.body, color: colors.ink, flex: 1 },
  sheet: {
    flex: 1,
    marginTop: -radii.sheet,
    paddingTop: spacing.gutter,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    backgroundColor: colors.bg,
  },
  sheetTitle: { ...typography.price, color: colors.ink, paddingHorizontal: spacing.gutter, marginBottom: spacing.sm },
  list: { paddingHorizontal: spacing.md, gap: 10 },
  notice: { gap: spacing.xxs },
  noticeTitle: { ...typography.subheading, color: colors.ink },
  noticeText: { ...typography.body, color: colors.muted },
});
