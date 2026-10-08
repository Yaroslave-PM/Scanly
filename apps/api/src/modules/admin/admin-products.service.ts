import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { normalizeBarcode, type NormalizedBarcode } from '../../common/barcode';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import type { ProductBody, ProductListQuery, ProductPatch } from './admin-products.schema';

const productInclude = {
  brand: { select: { name: true } },
  barcodes: { select: { code: true, format: true } },
  nutrition: true,
} satisfies Prisma.ProductInclude;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

const num = (value: Prisma.Decimal | null | undefined) => (value == null ? null : Number(value));

function toDto(p: ProductRow) {
  const n = p.nutrition;
  return {
    id: p.id,
    name: p.name,
    brand: p.brand?.name ?? null,
    barcodes: p.barcodes,
    imageUrl: p.imageUrl,
    netQuantity: num(p.netQuantity),
    unit: p.unit,
    ingredients: p.ingredients,
    allergens: p.allergens,
    status: p.status,
    source: p.source,
    popularity: p.popularity,
    editedAt: p.editedAt,
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
  };
}

const MISSING: Record<NonNullable<ProductListQuery['missing']>, Prisma.ProductWhereInput> = {
  image: { imageUrl: null },
  ingredients: { ingredients: null },
  nutrition: { OR: [{ nutrition: { is: null } }, { nutrition: { is: { kcal: null } } }] },
  any: {
    OR: [{ imageUrl: null }, { ingredients: null }, { nutrition: { is: null } }, { nutrition: { is: { kcal: null } } }],
  },
};

@Injectable()
export class AdminProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list({ q, missing, page, pageSize }: ProductListQuery) {
    const and: Prisma.ProductWhereInput[] = [];
    if (q) {
      and.push(
        /^\d{6,14}$/.test(q)
          ? { barcodes: { some: { code: { contains: q } } } }
          : {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { brand: { is: { name: { contains: q, mode: 'insensitive' } } } },
              ],
            },
      );
    }
    if (missing) and.push(MISSING[missing]);
    const where: Prisma.ProductWhereInput = { AND: and };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: [{ popularity: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);
    return { items: items.map(toDto), total, page, pageSize };
  }

  async get(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: productInclude });
    if (!product) throw new NotFoundException({ code: 'not_found', message: 'Товар не найден' });
    return toDto(product);
  }

  async create(body: ProductBody) {
    const barcodes = await this.checkBarcodes(body.barcodes);
    const product = await this.prisma.product.create({
      data: {
        ...this.fields(body),
        name: body.name,
        brandId: await this.brandId(body.brand),
        source: 'manual',
        editedAt: new Date(),
        barcodes: { create: barcodes },
        nutrition: body.nutrition ? { create: body.nutrition } : undefined,
      },
    });
    return this.get(product.id);
  }

  async update(id: string, patch: ProductPatch) {
    await this.get(id);
    const barcodes = patch.barcodes ? await this.checkBarcodes(patch.barcodes, id) : null;
    const ops: Prisma.PrismaPromise<unknown>[] = [
      this.prisma.product.update({
        where: { id },
        data: {
          ...this.fields(patch),
          ...(patch.brand !== undefined && { brandId: await this.brandId(patch.brand) }),
          editedAt: new Date(),
        },
      }),
    ];
    if (barcodes) {
      ops.push(this.prisma.barcode.deleteMany({ where: { productId: id, code: { notIn: barcodes.map((b) => b.code) } } }));
      ops.push(this.prisma.barcode.createMany({ data: barcodes.map((b) => ({ ...b, productId: id })), skipDuplicates: true }));
    }
    if (patch.nutrition === null) ops.push(this.prisma.nutrition.deleteMany({ where: { productId: id } }));
    if (patch.nutrition) {
      ops.push(
        this.prisma.nutrition.upsert({
          where: { productId: id },
          create: { productId: id, ...patch.nutrition },
          update: patch.nutrition,
        }),
      );
    }
    await this.prisma.$transaction(ops);
    return this.get(id);
  }

  private fields(body: ProductPatch) {
    return {
      name: body.name,
      imageUrl: body.imageUrl,
      netQuantity: body.netQuantity,
      unit: body.unit,
      ingredients: body.ingredients,
      allergens: body.allergens,
      status: body.status,
    };
  }

  private async brandId(name: string | null | undefined): Promise<string | null> {
    if (!name) return null;
    const brand = await this.prisma.brand.upsert({ where: { name }, create: { name }, update: {} });
    return brand.id;
  }

  /** Нормализует коды и проверяет, что они не заняты другим товаром. */
  private async checkBarcodes(raw: string[], productId?: string): Promise<NormalizedBarcode[]> {
    const invalid = raw.filter((code) => !normalizeBarcode(code));
    if (invalid.length) {
      throw new BadRequestException({ code: 'invalid_barcode', message: `Неверный штрихкод: ${invalid.join(', ')}` });
    }
    const barcodes = [...new Map(raw.map((code) => normalizeBarcode(code)!).map((b) => [b.code, b])).values()];
    const taken = await this.prisma.barcode.findMany({
      where: { code: { in: barcodes.map((b) => b.code) }, productId: productId ? { not: productId } : undefined },
      select: { code: true, productId: true },
    });
    if (taken.length) {
      throw new ConflictException({
        code: 'barcode_taken',
        message: `Штрихкод уже у другого товара: ${taken.map((t) => t.code).join(', ')}`,
        details: taken,
      });
    }
    return barcodes;
  }
}
