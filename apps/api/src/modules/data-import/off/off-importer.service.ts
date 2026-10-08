import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { readOffDump } from './off-dump';
import { isRussianMarket, mapOffRow, mightBeRussianMarket, type ProductInput } from './off-mapper';

const BATCH_SIZE = 500;

export interface OffImportOptions {
  source: string;
  saveTo?: string;
  limit?: number;
}

export interface OffImportReport {
  matched: number;
  invalid: number;
  created: number;
  updated: number;
  keptManualEdits: number;
}

@Injectable()
export class OffImporterService {
  private readonly logger = new Logger(OffImporterService.name);
  private readonly brandIds = new Map<string, string>();

  constructor(private readonly prisma: PrismaService) {}

  async run({ source, saveTo, limit }: OffImportOptions): Promise<OffImportReport> {
    const report: OffImportReport = { matched: 0, invalid: 0, created: 0, updated: 0, keptManualEdits: 0 };
    let batch: ProductInput[] = [];

    const rows = readOffDump({
      source,
      saveTo,
      lineFilter: mightBeRussianMarket,
      filter: isRussianMarket,
      onProgress: (n) => this.logger.log(`прочитано строк дампа: ${n}, подходит: ${report.matched}`),
    });

    for await (const row of rows) {
      report.matched++;
      const product = mapOffRow(row);
      if (!product) {
        report.invalid++;
        continue;
      }
      batch.push(product);
      if (batch.length >= BATCH_SIZE) {
        await this.saveBatch(batch, report);
        batch = [];
      }
      if (limit && report.matched >= limit) break;
    }
    if (batch.length) await this.saveBatch(batch, report);
    return report;
  }

  private async saveBatch(items: ProductInput[], report: OffImportReport) {
    // В дампе встречаются дубли одного кода (например, UPC-A и тот же код с нулём): берём последний.
    const byCode = new Map(items.map((item) => [item.barcode.code, item]));
    const existing = await this.prisma.barcode.findMany({
      where: { code: { in: [...byCode.keys()] } },
      select: { code: true, productId: true, product: { select: { editedAt: true } } },
    });
    const existingByCode = new Map(existing.map((b) => [b.code, b]));
    const brandIds = await this.ensureBrands([...byCode.values()]);

    const ops = [];
    for (const item of byCode.values()) {
      const data = {
        name: item.name,
        brandId: item.brand ? brandIds.get(item.brand) : null,
        imageUrl: item.imageUrl,
        netQuantity: item.netQuantity,
        unit: item.unit,
        ingredients: item.ingredients,
        allergens: item.allergens,
        popularity: item.popularity,
      };
      const found = existingByCode.get(item.barcode.code);

      if (!found) {
        report.created++;
        ops.push(
          this.prisma.product.create({
            data: {
              ...data,
              source: 'open_food_facts',
              barcodes: { create: { code: item.barcode.code, format: item.barcode.format } },
              nutrition: item.nutrition ? { create: item.nutrition } : undefined,
            },
          }),
        );
      } else if (found.product.editedAt) {
        report.keptManualEdits++;
      } else {
        report.updated++;
        ops.push(this.prisma.product.update({ where: { id: found.productId }, data }));
        ops.push(
          item.nutrition
            ? this.prisma.nutrition.upsert({
                where: { productId: found.productId },
                create: { productId: found.productId, ...item.nutrition },
                update: item.nutrition,
              })
            : this.prisma.nutrition.deleteMany({ where: { productId: found.productId } }),
        );
      }
    }
    await this.prisma.$transaction(ops);
  }

  private async ensureBrands(items: ProductInput[]): Promise<Map<string, string>> {
    const missing = [...new Set(items.map((i) => i.brand).filter((b): b is string => !!b))].filter(
      (name) => !this.brandIds.has(name),
    );
    if (missing.length) {
      await this.prisma.brand.createMany({ data: missing.map((name) => ({ name })), skipDuplicates: true });
      const brands = await this.prisma.brand.findMany({ where: { name: { in: missing } } });
      brands.forEach((b) => this.brandIds.set(b.name, b.id));
    }
    return this.brandIds;
  }
}
