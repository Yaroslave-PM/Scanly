import { CanActivate, ExecutionContext, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import type { Env } from '../../config/env';

const digest = (value: string) => createHash('sha256').update(value).digest();

/**
 * Временная защита админки общим токеном из ADMIN_TOKEN, до появления авторизации (этап 2).
 * Потом заменяется проверкой роли admin/moderator у пользователя.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService<Env, true>) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get('ADMIN_TOKEN', { infer: true });
    if (!expected) throw new ServiceUnavailableException({ code: 'admin_disabled', message: 'Админка выключена: не задан ADMIN_TOKEN' });

    const header = context.switchToHttp().getRequest<Request>().headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    // Сравниваем хэши, чтобы длина токена не влияла на время ответа.
    if (!token || !timingSafeEqual(digest(token), digest(expected))) {
      throw new UnauthorizedException({ code: 'unauthorized', message: 'Неверный токен админки' });
    }
    return true;
  }
}
