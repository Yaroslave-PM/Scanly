# Scanly

Мобильное приложение для осознанного выбора продуктов: навёл камеру на штрихкод и сразу понял, брать товар или нет.

Архитектура, модели данных, API и roadmap: `docs/architecture.md`.

## Структура

- `apps/mobile`: приложение (Expo, React Native, TypeScript)
- `apps/api`: бэкенд (NestJS, Prisma, PostgreSQL)
- `packages/design-tokens`: цвета, типографика, сетка 8pt
- `packages/contracts`: общие zod-схемы API
- `legacy/web-prototype`: старый веб-прототип, только как визуальный референс

## Запуск

```bash
pnpm install
pnpm db:up                                   # Postgres в Docker
cp apps/api/.env.example apps/api/.env
pnpm --filter @scanly/api prisma:migrate     # миграции
pnpm --filter @scanly/api start:dev          # API на :3000, swagger на /docs
pnpm --filter @scanly/mobile start           # приложение, открыть в Expo Go
```

Для проверки с телефона на одном wi-fi в `Expo Go` достаточно отсканировать QR из терминала.
