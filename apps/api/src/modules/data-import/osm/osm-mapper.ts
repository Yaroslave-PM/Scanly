export interface OsmElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface StoreInput {
  externalId: string;
  name: string;
  chain: string | null;
  address: string | null;
  city: string;
  lat: number;
  lng: number;
  openingHours: string | null;
}

/** Магазины, где продаются продукты. Аптеки, косметику и хозтовары не берём. */
export const GROCERY_SHOPS = [
  'supermarket', 'convenience', 'grocery', 'wholesale', 'department_store', 'general', 'deli',
  'dairy', 'bakery', 'butcher', 'beverages', 'farm', 'frozen_food', 'greengrocer',
  'confectionery', 'health_food', 'alcohol', 'seafood',
];

/**
 * Сети, которые в OSM часто записаны только названием, без тега brand.
 * Ключ: каноническое название, значение: варианты написания.
 */
const KNOWN_CHAINS: Record<string, string[]> = {
  'Пятёрочка': ['пятерочка', '5ка', 'pyaterochka'],
  'Магнит': ['магнит', 'магнит у дома', 'magnit'],
  'Магнит Семейный': ['магнит семейный', 'магнит экстра'],
  'Перекрёсток': ['перекресток', 'перекресток экспресс', 'perekrestok'],
  'ВкусВилл': ['вкусвилл', 'избенка', 'vkusvill'],
  'Лента': ['лента', 'супер лента', 'lenta'],
  'Ашан': ['ашан', 'атак', 'auchan'],
  'Дикси': ['дикси', 'dixy'],
  'Светофор': ['светофор'],
  'Чижик': ['чижик'],
  'Красное&Белое': ['красное белое', 'красноеибелое', 'красное и белое'],
  'Бристоль': ['бристоль'],
  'Metro': ['metro', 'метро', 'metro cash carry'],
  'О\'КЕЙ': ['окей', 'о кей', 'o key', 'okey'],
  'Spar': ['spar', 'спар'],
  'Фасоль': ['фасоль'],
  'Ассорти': ['ассорти'],
  'Солнечный круг': ['солнечный круг'],
  'Тавровские мясные лавки': ['тавровские мясные лавки', 'тавровские'],
  'Агрокомплекс Выселковский': ['агрокомплекс выселковский', 'агрокомплекс'],
  'Ванлав': ['ванлав', 'onelove'],
  'Добрыня': ['добрыня'],
};

export function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"'`.,!&+\-–—()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const CHAIN_BY_ALIAS = new Map(
  Object.entries(KNOWN_CHAINS).flatMap(([chain, aliases]) => aliases.map((alias) => [alias, chain] as const)),
);

export function detectChain(tags: Record<string, string>): string | null {
  const brand = tags.brand?.trim();
  if (brand) return CHAIN_BY_ALIAS.get(normalizeName(brand)) ?? brand;
  return tags.name ? (CHAIN_BY_ALIAS.get(normalizeName(tags.name)) ?? null) : null;
}

const SHOP_LABELS: Record<string, string> = {
  supermarket: 'Супермаркет',
  convenience: 'Продукты',
  butcher: 'Мясная лавка',
  bakery: 'Пекарня',
  alcohol: 'Алкомаркет',
  greengrocer: 'Овощи и фрукты',
  confectionery: 'Кондитерская',
  seafood: 'Рыба и морепродукты',
};

export function mapOsmElement(element: OsmElement, city: string): StoreInput | null {
  const tags = element.tags ?? {};
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  if (lat === undefined || lng === undefined || !tags.shop) return null;

  const chain = detectChain(tags);
  const street = tags['addr:street'];
  return {
    externalId: `osm:${element.type}/${element.id}`,
    name: tags.name?.trim() || chain || SHOP_LABELS[tags.shop] || 'Магазин',
    chain,
    address: street ? [street, tags['addr:housenumber']].filter(Boolean).join(', ') : null,
    city,
    lat,
    lng,
    openingHours: tags.opening_hours ?? null,
  };
}

/** Запрос к Overpass: все продуктовые магазины внутри административной границы. */
export function buildOverpassQuery(areaId: number): string {
  return `[out:json][timeout:120];area(id:${areaId})->.a;(nwr["shop"~"^(${GROCERY_SHOPS.join('|')})$"](area.a););out center tags;`;
}
