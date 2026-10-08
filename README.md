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

## Наполнение базы

```bash
pnpm --filter @scanly/api import:osm         # продуктовые магазины Ростова-на-Дону из OpenStreetMap, ~15 с
pnpm --filter @scanly/api import:off         # товары рынка РФ из дампа Open Food Facts, ~5 мин
pnpm --filter @scanly/api coverage           # сколько товаров с фото, составом, КБЖУ
```

`import:off` читает полный дамп (1.3 ГБ) потоком и берёт товары с отметкой «Россия» или российским кодом 460–469. Чтобы не качать дамп каждый раз, добавьте `-- --save off-ru.csv`, а в следующий раз `-- --source off-ru.csv`. Повторный импорт обновляет товары, но не трогает те, что правили в админке. Для другого города: `import:osm -- --area <area id из Overpass> --city <название>`.

Данные Open Food Facts и OpenStreetMap распространяются под лицензией ODbL: в приложении нужна атрибуция.

## Админка

`http://localhost:3000/admin/`: метрики покрытия, поиск товаров, фильтр «чего не хватает», добавление и правка. Вход по `ADMIN_TOKEN` из `apps/api/.env` (минимум 16 символов). Это временно: на этапе 2 вход станет по роли пользователя.
