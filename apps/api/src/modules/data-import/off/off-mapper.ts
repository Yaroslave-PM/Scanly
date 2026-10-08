import { normalizeBarcode, type NormalizedBarcode } from '../../../common/barcode';

export type OffRow = Record<string, string | undefined>;

export type ProductUnit = 'g' | 'kg' | 'ml' | 'l' | 'pcs';

export interface NutritionInput {
  kcal: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  sugar: number | null;
  fiber: number | null;
  salt: number | null;
}

export interface ProductInput {
  barcode: NormalizedBarcode;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  netQuantity: number | null;
  unit: ProductUnit | null;
  ingredients: string | null;
  allergens: string[];
  popularity: number;
  nutrition: NutritionInput | null;
}

/** Российские коды GS1: 460–469. Берём их даже без отметки страны, это товары российских производителей. */
const RU_PREFIX = /^46\d/;

/** Грубый фильтр сырой строки дампа (код идёт первой колонкой). Точную проверку делает isRussianMarket. */
export function mightBeRussianMarket(line: string): boolean {
  return line.startsWith('46') || line.includes('en:russia');
}

export function isRussianMarket(row: OffRow): boolean {
  const countries = row.countries_tags ?? '';
  return countries.split(',').includes('en:russia') || RU_PREFIX.test(row.code ?? '');
}

/** В дампе встречаются HTML-сущности: «вкус &quot;Топлёное молоко&quot;». */
const ENTITIES: Record<string, string> = { '&quot;': '"', '&#39;': "'", '&#34;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' };

function text(value: string | undefined, max: number): string | null {
  const cleaned = value
    ?.replace(/&(?:quot|#39|#34|amp|lt|gt|nbsp);/g, (entity) => ENTITIES[entity]!)
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned ? cleaned.slice(0, max) : null;
}

function number(value: string | undefined, max: number): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= max ? Math.round(n * 100) / 100 : null;
}

const UNIT_ALIASES: Record<string, ProductUnit> = {
  кг: 'kg', kg: 'kg',
  г: 'g', гр: 'g', g: 'g',
  мл: 'ml', ml: 'ml',
  л: 'l', l: 'l',
  шт: 'pcs', pcs: 'pcs',
};

const QUANTITY =
  /(?:(\d+)\s*[xх×*]\s*)?(\d+(?:[.,]\d+)?)\s*(кг|kg|гр|г|g|мл|ml|л|l|шт|pcs)(?![a-zа-яё])/iu;

/** «900 г», «0,5 л», «6 x 200 мл». Мультипак считаем общим объёмом упаковки. */
export function parseQuantity(raw: string | undefined): { netQuantity: number; unit: ProductUnit } | null {
  const match = raw ? QUANTITY.exec(raw) : null;
  if (!match) return null;
  const [, multiplier, amount, unitRaw] = match;
  const unit = UNIT_ALIASES[unitRaw!.toLowerCase()];
  const value = Number(amount!.replace(',', '.')) * (multiplier ? Number(multiplier) : 1);
  if (!unit || !Number.isFinite(value) || value <= 0 || value >= 100_000) return null;
  return { netQuantity: Math.round(value * 100) / 100, unit };
}

function nutrition(row: OffRow): NutritionInput | null {
  const result: NutritionInput = {
    kcal: number(row['energy-kcal_100g'], 950),
    protein: number(row.proteins_100g, 100),
    fat: number(row.fat_100g, 100),
    carbs: number(row.carbohydrates_100g, 100),
    sugar: number(row.sugars_100g, 100),
    fiber: number(row.fiber_100g, 100),
    salt: number(row.salt_100g, 100),
  };
  return Object.values(result).some((v) => v !== null) ? result : null;
}

/** Строка дампа Open Food Facts → товар. null, если без нормального штрихкода или названия. */
export function mapOffRow(row: OffRow): ProductInput | null {
  const barcode = normalizeBarcode(row.code ?? '');
  const name = text(row.product_name, 300) ?? text(row.generic_name, 300);
  if (!barcode || !name) return null;

  const image = row.image_url?.trim();
  const quantity = parseQuantity(row.quantity);

  return {
    barcode,
    name,
    brand: text(row.brands?.split(',')[0], 120),
    imageUrl: image?.startsWith('https://') ? image : null,
    netQuantity: quantity?.netQuantity ?? null,
    unit: quantity?.unit ?? null,
    ingredients: text(row.ingredients_text, 5000),
    allergens: (row.allergens ?? '')
      .split(',')
      .map((tag) => tag.trim().replace(/^[a-z]{2}:/, ''))
      .filter(Boolean),
    popularity: Math.trunc(number(row.unique_scans_n, 1e9) ?? 0),
    nutrition: nutrition(row),
  };
}
