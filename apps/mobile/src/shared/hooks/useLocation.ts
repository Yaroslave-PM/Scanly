import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface Point {
  lat: number;
  lng: number;
}

/** Стартовый город. Если человек не в Ростове или не дал доступ к геолокации, показываем центр. */
export const CITY = { name: 'Ростов-на-Дону', center: { lat: 47.2225, lng: 39.7187 } };
const CITY_RADIUS_KM = 60;

function distanceKm(a: Point, b: Point) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 12_742 * Math.asin(Math.sqrt(h));
}

export type LocationState =
  | { status: 'loading' }
  | { status: 'ready'; point: Point; source: 'device' | 'city'; reason?: 'denied' | 'far' };

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fallback = (reason: 'denied' | 'far') =>
        !cancelled && setState({ status: 'ready', point: CITY.center, source: 'city', reason });
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) return fallback('denied');
        const pos =
          (await Location.getLastKnownPositionAsync({ maxAge: 5 * 60_000 })) ??
          (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
        const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (distanceKm(point, CITY.center) > CITY_RADIUS_KM) return fallback('far');
        if (!cancelled) setState({ status: 'ready', point, source: 'device' });
      } catch {
        fallback('denied');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
