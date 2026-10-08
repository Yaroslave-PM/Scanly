import 'reflect-metadata';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { parseArgs } from 'node:util';
import { validateEnv } from '../config/env';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { CoverageModule } from '../modules/coverage/coverage.module';
import { CoverageService } from '../modules/coverage/coverage.service';
import { DataImportModule } from '../modules/data-import/data-import.module';
import { OFF_DUMP_URL } from '../modules/data-import/off/off-dump';
import { OffImporterService } from '../modules/data-import/off/off-importer.service';
import { OsmImporterService, ROSTOV } from '../modules/data-import/osm/osm-importer.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }), PrismaModule, DataImportModule, CoverageModule],
})
class CliModule {}

const USAGE = `Команды:
  import-off [--source <url|файл.csv[.gz]>] [--save <файл.csv>] [--limit <n>]
      товары рынка РФ из дампа Open Food Facts. --save сохраняет отфильтрованные строки,
      чтобы в следующий раз передать их в --source и не качать 1.3 ГБ заново
  import-osm [--area <overpass area id>] [--city <название>]
      продуктовые магазины города из OpenStreetMap (по умолчанию Ростов-на-Дону)
  coverage
      метрики покрытия базы`;

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { values } = parseArgs({
    args: rest,
    options: {
      source: { type: 'string' },
      save: { type: 'string' },
      limit: { type: 'string' },
      area: { type: 'string' },
      city: { type: 'string' },
    },
  });

  const app = await NestFactory.createApplicationContext(CliModule, { logger: ['log', 'warn', 'error'] });
  const logger = new Logger('cli');
  const started = Date.now();
  try {
    switch (command) {
      case 'import-off': {
        const source = values.source ?? OFF_DUMP_URL;
        logger.log(`импорт Open Food Facts из ${source}`);
        const report = await app.get(OffImporterService).run({
          source,
          saveTo: values.save,
          limit: values.limit ? Number(values.limit) : undefined,
        });
        logger.log(`готово: ${JSON.stringify(report)}`);
        break;
      }
      case 'import-osm': {
        const params = { areaId: values.area ? Number(values.area) : ROSTOV.areaId, city: values.city ?? ROSTOV.city };
        logger.log(`импорт магазинов OpenStreetMap: ${params.city}`);
        logger.log(`готово: ${JSON.stringify(await app.get(OsmImporterService).run(params))}`);
        break;
      }
      case 'coverage':
        console.log(JSON.stringify(await app.get(CoverageService).report(), null, 2));
        break;
      default:
        console.log(USAGE);
        process.exitCode = 1;
    }
    if (command?.startsWith('import')) logger.log(`заняло ${Math.round((Date.now() - started) / 1000)} с`);
  } finally {
    await app.close();
  }
}

void main();
