import { BadRequestException, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

/** Валидация тела и query zod-схемой. Ошибка в едином формате API: code, message, details. */
export class ZodPipe<T extends z.ZodType> implements PipeTransform<unknown, z.infer<T>> {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      throw new BadRequestException({
        code: 'validation_failed',
        message: 'Некорректные данные',
        details: z.flattenError(parsed.error),
      });
    }
    return parsed.data;
  }
}
