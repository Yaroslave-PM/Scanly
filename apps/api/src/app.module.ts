import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env';
import { PrismaModule } from './infra/prisma/prisma.module';
import { AdminModule } from './modules/admin/admin.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { StoresModule } from './modules/stores/stores.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }), PrismaModule, AdminModule, CatalogModule, StoresModule],
  controllers: [HealthController],
})
export class AppModule {}
