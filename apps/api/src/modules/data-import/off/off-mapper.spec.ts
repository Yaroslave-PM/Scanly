import { isRussianMarket, mapOffRow, parseQuantity } from './off-mapper';

describe('parseQuantity', () => {
  it.each([
    ['900 г', { netQuantity: 900, unit: 'g' }],
    ['0,5 л', { netQuantity: 0.5, unit: 'l' }],
    ['1.5L', { netQuantity: 1.5, unit: 'l' }],
    ['500 гр.', { netQuantity: 500, unit: 'g' }],
    ['6 x 200 мл', { netQuantity: 1200, unit: 'ml' }],
    ['1 кг', { netQuantity: 1, unit: 'kg' }],
    ['10 шт', { netQuantity: 10, unit: 'pcs' }],
  ])('%s', (raw, expected) => {
    expect(parseQuantity(raw)).toEqual(expected);
  });

  it('возвращает null для непонятного', () => {
    expect(parseQuantity('большая пачка')).toBeNull();
    expect(parseQuantity(undefined)).toBeNull();
  });
});

describe('isRussianMarket', () => {
  it('по отметке страны или российскому префиксу', () => {
    expect(isRussianMarket({ code: '5050083943652', countries_tags: 'en:france,en:russia' })).toBe(true);
    expect(isRussianMarket({ code: '4607100026020', countries_tags: '' })).toBe(true);
    expect(isRussianMarket({ code: '3017620422003', countries_tags: 'en:france' })).toBe(false);
  });
});

describe('mapOffRow', () => {
  const row = {
    code: '4607100026020',
    product_name: '  Рис   круглозерный ',
    brands: 'Донская Мельница, Другой',
    quantity: '900 г',
    image_url: 'https://images.openfoodfacts.org/images/products/460/710/002/6020/front_ru.3.400.jpg',
    ingredients_text: 'рис',
    allergens: 'en:gluten,en:milk',
    unique_scans_n: '12',
    'energy-kcal_100g': '332',
    proteins_100g: '7',
    fat_100g: '',
    carbohydrates_100g: '74.123',
  };

  it('собирает товар', () => {
    expect(mapOffRow(row)).toEqual({
      barcode: { code: '4607100026020', format: 'EAN13' },
      name: 'Рис круглозерный',
      brand: 'Донская Мельница',
      imageUrl: row.image_url,
      netQuantity: 900,
      unit: 'g',
      ingredients: 'рис',
      allergens: ['gluten', 'milk'],
      popularity: 12,
      nutrition: { kcal: 332, protein: 7, fat: null, carbs: 74.12, sugar: null, fiber: null, salt: null },
    });
  });

  it('расшифровывает HTML-сущности в названии', () => {
    expect(mapOffRow({ ...row, product_name: 'вафли вкус &quot;Топлёное молоко&quot; &amp; ваниль' })?.name).toBe(
      'вафли вкус "Топлёное молоко" & ваниль',
    );
  });

  it('пропускает товар без названия или с битым кодом', () => {
    expect(mapOffRow({ ...row, product_name: '', generic_name: '' })).toBeNull();
    expect(mapOffRow({ ...row, code: '123' })).toBeNull();
  });

  it('отбрасывает неправдоподобные КБЖУ', () => {
    expect(mapOffRow({ ...row, 'energy-kcal_100g': '3320', proteins_100g: '', carbohydrates_100g: '' })?.nutrition).toBeNull();
  });
});
