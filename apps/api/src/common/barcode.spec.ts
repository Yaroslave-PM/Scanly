import { normalizeBarcode } from './barcode';

describe('normalizeBarcode', () => {
  it('принимает валидный EAN-13', () => {
    expect(normalizeBarcode('4607100026020')).toEqual({ code: '4607100026020', format: 'EAN13' });
  });

  it('отбрасывает EAN-13 с неверной контрольной цифрой', () => {
    expect(normalizeBarcode('4607100026021')).toBeNull();
  });

  it('принимает EAN-8', () => {
    expect(normalizeBarcode('96385074')).toEqual({ code: '96385074', format: 'EAN8' });
  });

  it('хранит UPC-A как EAN-13 с ведущим нулём', () => {
    expect(normalizeBarcode('036000291452')).toEqual({ code: '0036000291452', format: 'UPCA' });
    expect(normalizeBarcode('0036000291452')).toEqual({ code: '0036000291452', format: 'UPCA' });
  });

  it('снимает ведущий ноль у GTIN-14 и мусор вокруг цифр', () => {
    expect(normalizeBarcode(' 04607100026020 ')).toEqual({ code: '4607100026020', format: 'EAN13' });
  });

  it('отбрасывает внутренние и обрезанные коды', () => {
    expect(normalizeBarcode('2000123')).toBeNull();
    expect(normalizeBarcode('')).toBeNull();
    expect(normalizeBarcode('123456789')).toBeNull();
  });
});
