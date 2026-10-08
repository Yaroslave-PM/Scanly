import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { buildOverpassQuery, mapOsmElement, type OsmElement, type StoreInput } from './osm-mapper';

/** Основной сервер Overpass и запасное зеркало: оба бесплатные и иногда отвечают таймаутом. */
const OVERPASS_URLS = ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];

/** Городской округ Ростов-на-Дону (relation 964255). Area id в Overpass = 3600000000 + id отношения. */
export const ROSTOV = { areaId: 3_600_964_255, city: 'Ростов-на-Дону' };

export interface OsmImportReport {
  found: number;
  saved: number;
  withChain: number;
  chains: number;
}

@Injectable()
export class OsmImporterService {
  private readonly logger = new Logger(OsmImporterService.name);

  constructor(private readonly prisma: PrismaService) {}

  async run({ areaId, city }: { areaId: number; city: string }): Promise<OsmImportReport> {
    const elements = await this.fetchElements(buildOverpassQuery(areaId));
    const stores = elements.map((e) => mapOsmElement(e, city)).filter((s): s is StoreInput => s !== null);

    const chainIds = await this.ensureChains(stores);
    for (let i = 0; i < stores.length; i += 200) {
      await this.prisma.$transaction(
        stores.slice(i, i + 200).map((s) => {
          const data = {
            name: s.name,
            chainId: s.chain ? chainIds.get(s.chain) : null,
            address: s.address,
            city: s.city,
            lat: s.lat,
            lng: s.lng,
            openingHours: s.openingHours ? { raw: s.openingHours } : undefined,
          };
          return this.prisma.store.upsert({
            where: { externalId: s.externalId },
            create: { ...data, externalId: s.externalId, type: 'offline' },
            update: data,
          });
        }),
      );
    }

    return {
      found: elements.length,
      saved: stores.length,
      withChain: stores.filter((s) => s.chain).length,
      chains: chainIds.size,
    };
  }

  private async fetchElements(query: string): Promise<OsmElement[]> {
    for (const url of OVERPASS_URLS) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Scanly/0.1 (data import)' },
          body: new URLSearchParams({ data: query }),
          signal: AbortSignal.timeout(180_000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { elements: OsmElement[] };
        return json.elements;
      } catch (error) {
        this.logger.warn(`Overpass ${url} не ответил: ${String(error)}`);
      }
    }
    throw new Error('Все серверы Overpass недоступны, попробуйте позже');
  }

  private async ensureChains(stores: StoreInput[]): Promise<Map<string, string>> {
    const names = [...new Set(stores.map((s) => s.chain).filter((c): c is string => !!c))];
    await this.prisma.storeChain.createMany({ data: names.map((name) => ({ name })), skipDuplicates: true });
    const chains = await this.prisma.storeChain.findMany({ where: { name: { in: names } } });
    return new Map(chains.map((c) => [c.name, c.id]));
  }
}
