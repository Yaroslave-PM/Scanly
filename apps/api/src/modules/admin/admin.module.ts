import { Module } from '@nestjs/common';
import { CoverageModule } from '../coverage/coverage.module';
import { AdminController } from './admin.controller';
import { AdminProductsService } from './admin-products.service';

@Module({
  imports: [CoverageModule],
  controllers: [AdminController],
  providers: [AdminProductsService],
})
export class AdminModule {}
