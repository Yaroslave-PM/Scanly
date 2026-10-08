import { z } from 'zod';

const nutrient = (max: number) => z.number().min(0).max(max).nullable();

/** Пустая строка из формы означает «очистить поле». */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null)
    .nullable()
    .optional();

export const NutritionBody = z.object({
  kcal: nutrient(950),
  protein: nutrient(100),
  fat: nutrient(100),
  carbs: nutrient(100),
  sugar: nutrient(100),
  fiber: nutrient(100),
  salt: nutrient(100),
});

export const ProductBody = z.object({
  name: z.string().trim().min(2).max(300),
  brand: optionalText(120),
  barcodes: z.array(z.string().trim()).min(1).max(10),
  imageUrl: z.url({ protocol: /^https$/ }).nullable().optional(),
  netQuantity: z.number().positive().max(100_000).nullable().optional(),
  unit: z.enum(['g', 'kg', 'ml', 'l', 'pcs']).nullable().optional(),
  ingredients: optionalText(5000),
  allergens: z.array(z.string().trim().min(1).max(60)).max(30).optional(),
  status: z.enum(['active', 'draft', 'hidden']).optional(),
  nutrition: NutritionBody.nullable().optional(),
});
export type ProductBody = z.infer<typeof ProductBody>;

export const ProductPatch = ProductBody.partial();
export type ProductPatch = z.infer<typeof ProductPatch>;

export const ProductListQuery = z.object({
  q: z.string().trim().max(200).optional(),
  /** Фильтр «чего не хватает»: удобно добивать покрытие, начиная с популярных товаров. */
  missing: z.enum(['image', 'ingredients', 'nutrition', 'any']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(30),
});
export type ProductListQuery = z.infer<typeof ProductListQuery>;
