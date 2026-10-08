import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  /** Токен для /admin до появления авторизации. Без него админка выключена. */
  ADMIN_TOKEN: z.preprocess((v) => v || undefined, z.string().min(16).optional()),
});

export type Env = z.infer<typeof schema>;

/** Единая точка чтения окружения: падаем на старте, а не посреди запроса. */
export function validateEnv(raw: Record<string, unknown>): Env {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Некорректное окружение: ${JSON.stringify(z.treeifyError(parsed.error))}`);
  }
  return parsed.data;
}
