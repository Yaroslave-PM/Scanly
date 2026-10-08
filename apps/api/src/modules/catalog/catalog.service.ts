import { Injectable, NotFoundException } from '@nestjs/common';
import type { ProductCard, ProductListItem, ProductSearchResponse, RatingSummary } from '@scanly/contracts';
import { normalizeBarcode } from '../../common/barcode';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

const cardInclude = {
  brand: { select: { name: true } },
  barcodes: { select: { code: true }, take: 1 },
  nutrition: true,
  rating: true,
} satisfies Prisma.ProductInclude;

const listSelect = {
  id: true,
  name: true,
  imageUrl: true,
  netQuantity: true,
  unit: true,
  brand: { select: { name: true } },
  rating: { select: { average: true, count: true } },
} satisfies Prisma.ProductSelect;

const num = (value: Prisma.Decimal | null | undefined) => (value == null ? null : Number(value));

const notFound = () => new NotFoundException({ code: 'product_not_found', message: 'Товар не найден' });

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  /** Главный запрос скана. Каждый скан пишем в scan_events: из них считается доля найденных товаров. */
  async byBarcode(raw: string): Promise<ProductCard> {
    const barcode = normalizeBarcode(raw);
    const found = barcode
      ? await this.prisma.barcode.findUnique({
          where: { code: barcode.code },
          select: { product: { include: cardInclude } },
        })
      : null;
    const product = found?.product.status === 'active' ? found.product : null;

    await this.prisma.scanEvent.create({
      data: { barcode: barcode?.code ?? raw.slice(0, 32), productId: product?.id, found: !!product },
    });
    if (!product) throw notFound();
    return this.toCard(product);
  }

  async byId(id: string): Promise<ProductCard> {
    const product = await this.prisma.product.findFirst({ where: { id, status: 'active' }, include: cardInclude });
    if (!product) throw notFound();
    return this.toCard(product);
  }

  /**
   * Поиск по словам в названии и бренде, по цифрам ищем штрихкод.
   * Без запроса отдаём популярные товары с полной карточкой: так главная не пустая.
   */
  async search(q: string | undefined, page: number, limit: number): Promise<ProductSearchResponse> {
    const where: Prisma.ProductWhereInput = { status: 'active' };
    const query = q?.trim();
    if (!query) {
      Object.assign(where, { imageUrl: { not: null }, ingredients: { not: null }, nutrition: { is: { kcal: { not: null } } } });
    } else if (/^\d{4,14}$/.test(query)) {
      where.barcodes = { some: { code: { startsWith: query } } };
    } else {
      where.AND = query
        .split(/\s+/)
        .slice(0, 5)
        .map((word) => ({
          OR: [
            { name: { contains: word, mode: 'insensitive' as const } },
            { brand: { is: { name: { contains: word, mode: 'insensitive' as const } } } },
          ],
        }));
    }

    const rows = await this.prisma.product.findMany({
      where,
      select: listSelect,
      orderBy: [{ popularity: 'desc' }, { name: 'asc' }],
      skip: (page - 1) * limit,
      take: limit + 1,
    });
    return {
      items: rows.slice(0, limit).map(
        (p): ProductListItem => ({
          id: p.id,
          name: p.name,
          brand: p.brand?.name ?? null,
          imageUrl: p.imageUrl,
          netQuantity: num(p.netQuantity),
          unit: p.unit,
          rating: { average: num(p.rating?.average) ?? 0, count: p.rating?.count ?? 0 },
        }),
      ),
      nextPage: rows.length > limit ? page + 1 : null,
    };
  }

  private toCard(p: Prisma.ProductGetPayload<{ include: typeof cardInclude }>): ProductCard {
    const n = p.nutrition;
    const d = p.rating?.distribution ?? [];
    const rating: RatingSummary = {
      average: num(p.rating?.average) ?? 0,
      count: p.rating?.count ?? 0,
      distribution: [d[0] ?? 0, d[1] ?? 0, d[2] ?? 0, d[3] ?? 0, d[4] ?? 0],
    };
    return {
      product: {
        id: p.id,
        name: p.name,
        brand: p.brand?.name ?? null,
        imageUrl: p.imageUrl,
        netQuantity: num(p.netQuantity),
        unit: p.unit,
        ingredients: p.ingredients,
        allergens: p.allergens,
        barcode: p.barcodes[0]?.code ?? null,
      },
      // Цены появятся на этапе 6, избранное после авторизации.
      bestPrice: null,
      rating,
      nutrition: n
        ? {
            kcal: num(n.kcal),
            protein: num(n.protein),
            fat: num(n.fat),
            carbs: num(n.carbs),
            sugar: num(n.sugar),
            fiber: num(n.fiber),
            salt: num(n.salt),
          }
        : null,
      isFavorite: false,
    };
  }
}
