import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../theme';

const formatters = new Map<string, Intl.NumberFormat>();

export function formatPrice(amount: number, currency = 'RUB'): string {
  let f = formatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat('ru-RU', { style: 'currency', currency, maximumFractionDigits: 2 });
    formatters.set(currency, f);
  }
  return f.format(amount);
}

export function Price({ amount, currency }: { amount: number; currency?: string }) {
  return <Text style={styles.price}>{formatPrice(amount, currency)}</Text>;
}

const styles = StyleSheet.create({ price: { ...typography.price, color: colors.ink } });
