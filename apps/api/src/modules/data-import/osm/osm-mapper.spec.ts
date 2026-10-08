import { buildOverpassQuery, detectChain, mapOsmElement } from './osm-mapper';

describe('detectChain', () => {
  it('берёт brand и приводит к каноническому написанию', () => {
    expect(detectChain({ brand: 'Перекресток' })).toBe('Перекрёсток');
    expect(detectChain({ brand: 'Красное&Белое' })).toBe('Красное&Белое');
  });

  it('оставляет незнакомый brand как есть', () => {
    expect(detectChain({ brand: 'Новая сеть' })).toBe('Новая сеть');
  });

  it('узнаёт сеть по названию без brand', () => {
    expect(detectChain({ name: 'ПЯТЕРОЧКА' })).toBe('Пятёрочка');
    expect(detectChain({ name: '«Магнит»' })).toBe('Магнит');
    expect(detectChain({ name: 'Продукты' })).toBeNull();
  });
});

describe('mapOsmElement', () => {
  it('собирает магазин из way с центром', () => {
    expect(
      mapOsmElement(
        {
          type: 'way',
          id: 42,
          center: { lat: 47.22, lon: 39.71 },
          tags: { shop: 'supermarket', brand: 'Магнит', 'addr:street': 'Большая Садовая улица', 'addr:housenumber': '10', opening_hours: '08:00-22:00' },
        },
        'Ростов-на-Дону',
      ),
    ).toEqual({
      externalId: 'osm:way/42',
      name: 'Магнит',
      chain: 'Магнит',
      address: 'Большая Садовая улица, 10',
      city: 'Ростов-на-Дону',
      lat: 47.22,
      lng: 39.71,
      openingHours: '08:00-22:00',
    });
  });

  it('даёт понятное название безымянному магазину', () => {
    expect(mapOsmElement({ type: 'node', id: 1, lat: 1, lon: 2, tags: { shop: 'convenience' } }, 'X')?.name).toBe('Продукты');
  });

  it('пропускает элементы без координат', () => {
    expect(mapOsmElement({ type: 'relation', id: 1, tags: { shop: 'supermarket' } }, 'X')).toBeNull();
  });
});

it('buildOverpassQuery подставляет область', () => {
  expect(buildOverpassQuery(3600964255)).toContain('area(id:3600964255)');
});
