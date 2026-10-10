import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProductListItem } from '@scanly/contracts';
import { useSyncExternalStore } from 'react';

const KEY = 'favorites:v1';

/**
 * Избранное до появления аккаунтов хранится на устройстве.
 * После входа (этап 2) переедет на сервер в /me/favorites, локальный список перенесём туда.
 */
let items: ProductListItem[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      items = JSON.parse(raw) as ProductListItem[];
      emit();
    }
  } catch {
    // Повреждённое хранилище не должно ломать приложение: начинаем с пустого списка.
  }
}

function save() {
  emit();
  void AsyncStorage.setItem(KEY, JSON.stringify(items)).catch(() => undefined);
}

export function toggleFavorite(item: ProductListItem) {
  items = items.some((i) => i.id === item.id) ? items.filter((i) => i.id !== item.id) : [item, ...items];
  save();
}

function subscribe(listener: () => void) {
  void load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFavorites(): ProductListItem[] {
  return useSyncExternalStore(subscribe, () => items);
}

export function useIsFavorite(id: string): boolean {
  return useSyncExternalStore(subscribe, () => items.some((i) => i.id === id));
}
