import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodPipe } from '../../common/zod.pipe';
import { StoresService } from './stores.service';

const Point = {
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
};

const NearbyQuery = z.object({
  ...Point,
  radius: z.coerce.number().int().min(100).max(30_000).default(5_000),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});
type NearbyQuery = z.infer<typeof NearbyQuery>;

const PricesQuery = z.object({ ...Point, sort: z.enum(['price', 'distance']).default('price') });
type PricesQuery = z.infer<typeof PricesQuery>;

@ApiTags('stores')
@Controller()
export class StoresController {
  constructor(private readonly stores: StoresService) {}

  @Get('stores/nearby')
  nearby(@Query(new ZodPipe(NearbyQuery)) { lat, lng, radius, limit }: NearbyQuery) {
    return this.stores.nearby({ lat, lng }, radius, limit);
  }

  @Get('products/:id/prices')
  prices(@Param('id', ParseUUIDPipe) id: string, @Query(new ZodPipe(PricesQuery)) { lat, lng, sort }: PricesQuery) {
    return this.stores.productPrices(id, { lat, lng }, sort);
  }
}
