export type BarcodeFormat = 'EAN13' | 'EAN8' | 'UPCA';

export interface NormalizedBarcode {
  /** Код в каноническом виде: UPC-A хранится как EAN-13 с ведущим нулём, чтобы скан с любым форматом находил один товар. */
  code: string;
  format: BarcodeFormat;
}

/** Контрольная цифра GTIN (EAN-8, UPC-A, EAN-13, GTIN-14): веса 3 и 1 справа налево. */
function hasValidCheckDigit(digits: string): boolean {
  let sum = 0;
  for (let i = digits.length - 2, weight = 3; i >= 0; i--, weight = weight === 3 ? 1 : 3) {
    sum += Number(digits[i]) * weight;
  }
  return (10 - (sum % 10)) % 10 === Number(digits[digits.length - 1]);
}

/**
 * Приводит штрихкод к каноническому виду. Возвращает null для внутренних кодов магазинов,
 * обрезанных кодов и кодов с неверной контрольной цифрой.
 * UPC-E не разворачиваем: восемь цифр неотличимы от EAN-8, а в российской рознице он почти не встречается.
 */
export function normalizeBarcode(raw: string): NormalizedBarcode | null {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 14 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 13 && digits.startsWith('0') && hasValidCheckDigit(digits)) {
    return { code: digits, format: 'UPCA' };
  }

  switch (digits.length) {
    case 8:
      return hasValidCheckDigit(digits) ? { code: digits, format: 'EAN8' } : null;
    case 12:
      return hasValidCheckDigit(digits) ? { code: `0${digits}`, format: 'UPCA' } : null;
    case 13:
      return hasValidCheckDigit(digits) ? { code: digits, format: 'EAN13' } : null;
    default:
      return null;
  }
}
