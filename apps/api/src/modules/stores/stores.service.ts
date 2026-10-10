import { Injectable } from '@nestjs/common';
import type { NearbyStore, NearbyStoresResponse, ProductPricesResponse } from '@scanly/contracts';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

const EARTH_RADIUS_M = 6_371_000;
const METERS_PER_DEGREE = 111_320;

interface Point {
  lat: number;
  lng: number;
}

/** Расстояние по формуле гаверсинусов, в метрах. PostGIS подключим, когда магазинов станет много. */
const distanceSql = ({ lat, lng }: Point) => Prisma.sql`
  round(${EARTH_RADIUS_M} * 2 * asin(sqrt(
    power(sin(radians(s.lat - ${lat}) / 2), 2) +
    cos(radians(${lat})) * cos(radians(s.lat)) * power(sin(radians(s.lng - ${lng}) / 2), 2)
  )))::int`;

/** Грубый прямоугольник вокруг точки: отсекает дальние магазины до точного расчёта. */
function boundingBox({ lat, lng }: Point, radiusM: number) {
  const dLat = radiusM / METERS_PER_DEGREE;
  const dLng = radiusM / (METERS_PER_DEGREE * Math.max(Math.cos((lat * Math.PI) / 180), 0.01));
  return Prisma.sql`s.lat BETWEEN ${lat - dLat} AND ${lat + dLat} AND s.lng BETWEEN ${lng - dLng} AND ${lng + dLng}`;
}

interface StoreRow {
  id: string;
  name: string;
  chain: string | null;
  address: string | null;
  lat: number;
  lng: number;
  distance_m: number;
}

const toStore = (r: StoreRow): NearbyStore => ({
  id: r.id,
  name: r.name,
  chain: r.chain,
  address: r.address,
  lat: r.lat,
  lng: r.lng,
  distanceM: r.distance_m,
});

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async nearby(point: Point, radiusM: number, limit: number): Promise<NearbyStoresResponse> {
    const rows = await this.prisma.$queryRaw<StoreRow[]>`
      SELECT s.id, s.name, c.name AS chain, s.address, s.lat, s.lng, ${distanceSql(point)} AS distance_m
      FROM stores s
      LEFT JOIN store_chains c ON c.id = s.chain_id
      WHERE s.lat IS NOT NULL AND s.lng IS NOT NULL AND ${boundingBox(point, radiusM)}
      ORDER BY distance_m
      LIMIT ${limit}`;
    return { items: rows.filter((r) => r.distance_m <= radiusM).map(toStore) };
  }

  /** Цены товара в магазинах. Пока цен в базе нет, ответ честно пустой. */
  async productPrices(productId: string, point: Point, sort: 'price' | 'distance'): Promise<ProductPricesResponse> {
    const order = sort === 'price' ? Prisma.sql`p.amount, distance_m` : Prisma.sql`distance_m, p.amount`;
    const rows = await this.prisma.$queryRaw<(StoreRow & { price_id: string; amount: Prisma.Decimal; currency: string; observed_at: Date; source: string })[]>`
      SELECT p.id AS price_id, p.amount, p.currency, p.observed_at, p.source,
             s.id, s.name, c.name AS chain, s.address, s.lat, s.lng, ${distanceSql(point)} AS distance_m
      FROM prices p
      JOIN stores s ON s.id = p.store_id
      LEFT JOIN store_chains c ON c.id = s.chain_id
      WHERE p.product_id = ${productId}::uuid AND s.lat IS NOT NULL AND p.availability <> 'out_of_stock'
      ORDER BY ${order}
      LIMIT 50`;
    return {
      items: rows.map((r) => ({
        id: r.price_id,
        amount: Number(r.amount),
        currency: r.currency.trim(),
        observedAt: r.observed_at.toISOString(),
        source: r.source as ProductPricesResponse['items'][number]['source'],
        store: toStore(r),
      })),
    };
  }
}
