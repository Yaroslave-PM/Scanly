import { config } from '../config';

/** Ошибка API в едином формате бэкенда: code, message. status 0 значит, что сервер недоступен. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isNetwork() {
    return this.status === 0;
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  // AbortSignal.timeout и AbortSignal.any есть не во всех версиях Hermes, собираем вручную.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  let res: Response;
  try {
    res = await fetch(config.apiUrl + path, { headers: { Accept: 'application/json' }, signal: controller.signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(0, 'network', 'Нет связи с сервером');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }

  const body = (await res.json().catch(() => null)) as { code?: string; message?: string } | null;
  if (!res.ok) throw new ApiError(res.status, body?.code ?? 'unknown', body?.message ?? `Ошибка ${res.status}`);
  return body as T;
}
