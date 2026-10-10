import { z } from 'zod';

export const Unit = z.enum(['g', 'kg', 'ml', 'l', 'pcs']);
export type Unit = z.infer<typeof Unit>;

export const Availability = z.enum(['in_stock', 'low', 'out_of_stock', 'unknown']);
export type Availability = z.infer<typeof Availability>;

export const PriceSource = z.enum(['partner_feed', 'import', 'user_report', 'review']);
export type PriceSource = z.infer<typeof PriceSource>;

export const StoreSummary = z.object({
  id: z.string().uuid(),
  name: z.string(),
  chain: z.string().nullable(),
  distanceM: z.number().nullable(),
});
export type StoreSummary = z.infer<typeof StoreSummary>;

export const BestPrice = z.object({
  amount: z.number(),
  currency: z.string().length(3),
  store: StoreSummary,
  observedAt: z.string().datetime(),
  source: PriceSource,
});
export type BestPrice = z.infer<typeof BestPrice>;

export const RatingSummary = z.object({
  average: z.number().min(0).max(5),
  count: z.number().int().nonnegative(),
  distribution: z.tuple([z.number(), z.number(), z.number(), z.number(), z.number()]),
});
export type RatingSummary = z.infer<typeof RatingSummary>;

export const Nutrition = z.object({
  kcal: z.number().nullable(),
  protein: z.number().nullable(),
  fat: z.number().nullable(),
  carbs: z.number().nullable(),
  sugar: z.number().nullable(),
  fiber: z.number().nullable(),
  salt: z.number().nullable(),
});
export type Nutrition = z.infer<typeof Nutrition>;

/** Ответ карточки товара: скан и поиск открывают один и тот же экран. */
export const ProductCard = z.object({
  product: z.object({
    id: z.string().uuid(),
    name: z.string(),
    brand: z.string().nullable(),
    imageUrl: z.string().nullable(),
    netQuantity: z.number().nullable(),
    unit: Unit.nullable(),
    ingredients: z.string().nullable(),
    allergens: z.array(z.string()),
    barcode: z.string().nullable(),
  }),
  bestPrice: BestPrice.nullable(),
  rating: RatingSummary,
  nutrition: Nutrition.nullable(),
  isFavorite: z.boolean(),
});
export type ProductCard = z.infer<typeof ProductCard>;

/** Строка списка: поиск, подборки на главной. */
export const ProductListItem = z.object({
  id: z.string().uuid(),
  name: z.string(),
  brand: z.string().nullable(),
  imageUrl: z.string().nullable(),
  netQuantity: z.number().nullable(),
  unit: Unit.nullable(),
  rating: z.object({ average: z.number(), count: z.number().int() }),
});
export type ProductListItem = z.infer<typeof ProductListItem>;

export const ProductSearchResponse = z.object({
  items: z.array(ProductListItem),
  nextPage: z.number().int().nullable(),
});
export type ProductSearchResponse = z.infer<typeof ProductSearchResponse>;

export const NearbyStore = z.object({
  id: z.string().uuid(),
  name: z.string(),
  chain: z.string().nullable(),
  address: z.string().nullable(),
  lat: z.number(),
  lng: z.number(),
  distanceM: z.number().int(),
});
export type NearbyStore = z.infer<typeof NearbyStore>;

export const NearbyStoresResponse = z.object({ items: z.array(NearbyStore) });
export type NearbyStoresResponse = z.infer<typeof NearbyStoresResponse>;

/** Цена товара в конкретном магазине для экрана сравнения. */
export const PriceOffer = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  currency: z.string().length(3),
  observedAt: z.string().datetime(),
  source: PriceSource,
  store: NearbyStore,
});
export type PriceOffer = z.infer<typeof PriceOffer>;

export const ProductPricesResponse = z.object({ items: z.array(PriceOffer) });
export type ProductPricesResponse = z.infer<typeof ProductPricesResponse>;

export const ApiError = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof ApiError>;
