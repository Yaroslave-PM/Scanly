import { StateView } from '@/shared/ui';

export default function FavoritesTab() {
  return (
    <StateView
      icon="heart-outline"
      title="Избранное"
      text="Сохраняйте товары, к которым хотите вернуться. Появится вместе со входом в аккаунт."
    />
  );
}
