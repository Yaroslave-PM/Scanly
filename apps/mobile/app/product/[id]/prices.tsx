import { useLocalSearchParams } from 'expo-router';
import { useProduct } from '@/features/catalog/api';
import { StoresMapScreen } from '@/features/stores/StoresMapScreen';

export default function ProductPricesRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useProduct(id);
  return <StoresMapScreen product={{ id, name: product.data?.product.name ?? 'Товар' }} />;
}
