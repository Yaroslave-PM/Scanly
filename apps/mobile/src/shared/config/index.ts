import Constants from 'expo-constants';

/** Порт API при локальной разработке. */
const DEV_API_PORT = 3000;

/**
 * Адрес API. Порядок:
 * 1. EXPO_PUBLIC_API_URL из apps/mobile/.env (обязателен для staging и прода);
 * 2. в разработке: тот же компьютер, где запущен Expo. Телефон уже ходит к нему за бандлом,
 *    так что IP ноутбука в сети берём из hostUri и не прописываем руками.
 */
function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return `http://${host ?? 'localhost'}:${DEV_API_PORT}/v1`;
}

export const config = {
  apiUrl: resolveApiUrl(),
  requestTimeoutMs: 10_000,
} as const;
