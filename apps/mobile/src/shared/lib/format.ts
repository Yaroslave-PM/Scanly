import type { Unit } from '@scanly/contracts';

const UNIT_LABELS: Record<Unit, string> = { g: 'г', kg: 'кг', ml: 'мл', l: 'л', pcs: 'шт' };

const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });

/** «900 г», «1,5 л». null, если вес неизвестен. */
export function formatQuantity(amount: number | null, unit: Unit | null): string | null {
  if (amount === null || unit === null) return null;
  return `${number.format(amount)} ${UNIT_LABELS[unit]}`;
}

export function formatNumber(value: number): string {
  return number.format(value);
}

/** 1 отзыв, 2 отзыва, 5 отзывов. */
export function plural(n: number, [one, few, many]: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
