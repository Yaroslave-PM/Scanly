import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodPipe } from '../../common/zod.pipe';
import { CoverageService } from '../coverage/coverage.service';
import { AdminGuard } from './admin.guard';
import { ProductBody, ProductListQuery, ProductPatch } from './admin-products.schema';
import { AdminProductsService } from './admin-products.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly products: AdminProductsService,
    private readonly coverage: CoverageService,
  ) {}

  @Get('coverage')
  coverageReport() {
    return this.coverage.report();
  }

  @Get('products')
  list(@Query(new ZodPipe(ProductListQuery)) query: ProductListQuery) {
    return this.products.list(query);
  }

  @Get('products/:id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.products.get(id);
  }

  @Post('products')
  create(@Body(new ZodPipe(ProductBody)) body: ProductBody) {
    return this.products.create(body);
  }

  @Patch('products/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body(new ZodPipe(ProductPatch)) body: ProductPatch) {
    return this.products.update(id, body);
  }
}
