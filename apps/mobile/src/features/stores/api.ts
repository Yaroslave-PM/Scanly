import type { NearbyStoresResponse, ProductPricesResponse } from '@scanly/contracts';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/shared/api/client';
import type { Point } from '@/shared/hooks/useLocation';

/** Координаты округляем до ~100 м: так кэш не сбрасывается от каждого сдвига GPS. */
const round = (p: Point) => ({ lat: p.lat.toFixed(3), lng: p.lng.toFixed(3) });

export function useNearbyStores(point: Point | null, radius = 3000) {
  return useQuery({
    queryKey: ['stores', 'nearby', point && round(point), radius],
    enabled: !!point,
    queryFn: ({ signal }) =>
      apiGet<NearbyStoresResponse>(
        `/stores/nearby?${new URLSearchParams({ ...round(point!), radius: String(radius), limit: '30' })}`,
        signal,
      ),
  });
}

export function useProductPrices(productId: string, point: Point | null, sort: 'price' | 'distance') {
  return useQuery({
    queryKey: ['prices', productId, point && round(point), sort],
    enabled: !!point,
    queryFn: ({ signal }) =>
      apiGet<ProductPricesResponse>(
        `/products/${productId}/prices?${new URLSearchParams({ ...round(point!), sort })}`,
        signal,
      ),
  });
}
