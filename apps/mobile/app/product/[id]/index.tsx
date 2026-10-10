import { useLocalSearchParams } from 'expo-router';
import { ProductScreen } from '@/features/catalog/ProductScreen';

export default function ProductRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductScreen id={id} />;
}
