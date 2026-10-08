import 'reflect-metadata';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import type { Env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('v1');
  // Простая админка: одна статическая страница, данные берёт из /v1/admin/*.
  app.useStaticAssets(join(__dirname, '..', 'admin'), { prefix: '/admin' });

  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Scanly API').setVersion('0.1').addBearerAuth().build(),
  );
  SwaggerModule.setup('docs', app, doc);

  await app.listen(app.get(ConfigService<Env, true>).get('PORT', { infer: true }));
}
void bootstrap();
