import { createReadStream, createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import type { ReadableStream as WebReadableStream } from 'node:stream/web';
import { createGunzip } from 'node:zlib';
import type { OffRow } from './off-mapper';

/** Полный CSV-дамп Open Food Facts (TSV, ~1.3 ГБ в gzip). Читаем потоком, на диск целиком не сохраняем. */
export const OFF_DUMP_URL = 'https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz';

const USER_AGENT = 'Scanly/0.1 (data import; https://github.com/Yaroslave-PM/Scanly)';

async function openSource(source: string): Promise<Readable> {
  let stream: Readable;
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok || !res.body) throw new Error(`Не удалось скачать дамп: HTTP ${res.status}`);
    stream = Readable.fromWeb(res.body as WebReadableStream<Uint8Array>);
  } else {
    stream = createReadStream(source);
  }
  return source.endsWith('.gz') ? stream.pipe(createGunzip()) : stream;
}

export interface ReadDumpOptions {
  source: string;
  filter: (row: OffRow) => boolean;
  /** Дешёвая проверка сырой строки до разбора: в дампе миллионы строк по ~200 колонок. */
  lineFilter?: (line: string) => boolean;
  /** Куда сохранить отфильтрованные строки, чтобы следующий импорт не качал весь дамп заново. */
  saveTo?: string;
  onProgress?: (linesRead: number) => void;
}

/** Отдаёт строки дампа, прошедшие фильтр, как объекты «колонка → значение». */
export async function* readOffDump({
  source,
  filter,
  lineFilter,
  saveTo,
  onProgress,
}: ReadDumpOptions): AsyncGenerator<OffRow> {
  const lines = createInterface({ input: await openSource(source), crlfDelay: Infinity });
  const out = saveTo ? createWriteStream(saveTo, 'utf8') : null;
  let header: string[] | null = null;
  let linesRead = 0;

  try {
    for await (const line of lines) {
      if (!header) {
        header = line.split('\t');
        out?.write(`${line}\n`);
        continue;
      }
      if (++linesRead % 100_000 === 0) onProgress?.(linesRead);
      if (lineFilter && !lineFilter(line)) continue;

      const cells = line.split('\t');
      const row: OffRow = {};
      header.forEach((column, i) => (row[column] = cells[i]));
      if (!filter(row)) continue;

      if (out && !out.write(`${line}\n`)) await new Promise<void>((resolve) => out.once('drain', resolve));
      yield row;
    }
  } finally {
    lines.close();
    if (out) await new Promise<void>((resolve) => out.end(resolve));
  }
}
