import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodPipe } from '../../common/zod.pipe';
import { CatalogService } from './catalog.service';

const SearchQuery = z.object({
  q: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).max(500).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
type SearchQuery = z.infer<typeof SearchQuery>;

/** Публичный каталог: смотреть товары можно без входа. */
@ApiTags('catalog')
@Controller('products')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('search')
  search(@Query(new ZodPipe(SearchQuery)) { q, page, limit }: SearchQuery) {
    return this.catalog.search(q, page, limit);
  }

  @Get('by-barcode/:code')
  byBarcode(@Param('code') code: string) {
    return this.catalog.byBarcode(code);
  }

  @Get(':id')
  byId(@Param('id', ParseUUIDPipe) id: string) {
    return this.catalog.byId(id);
  }
}
