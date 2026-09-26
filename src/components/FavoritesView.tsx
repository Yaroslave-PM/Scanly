import React from 'react';
import {
  Heart,
  TrendingDown,
  Bell,
  Trash2,
  ScanBarcode,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../data/products';

interface FavoritesViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
  onOpenScanner: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  products,
  onSelectProduct,
  onToggleFavorite,
  onOpenScanner,
}) => {
  const favoriteProducts = products.filter((p) => p.isFavorite);

  return (
    <div className="space-y-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#6D8C6B] uppercase tracking-wider">
            Отслеживание цен
          </span>
          <h2 className="text-xl font-black text-[#142C12] tracking-tight">
            Избранные товары
          </h2>
        </div>

        <span className="px-3 py-1 rounded-full glass-pill text-xs font-bold text-[#142C12] shadow-xs">
          {favoriteProducts.length} сохранено
        </span>
      </div>

      {/* Price Alert Simulation Notification Banner (Glass Card) */}
      <div className="p-4 rounded-3xl glass-card-dark text-white shadow-md border border-white/20 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#D8FF4F] text-[#071304] flex items-center justify-center shrink-0 shadow-xs">
            <Bell className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#D8FF4F]">
                Снижение цены обнаружено
              </span>
              <span className="text-[10px] text-emerald-200">Сегодня</span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1 leading-snug font-medium">
              Шоколад <strong>Ritter Sport Марципан</strong> подешевел в Пятёрочке! Было 179 ₽ → стало <strong>149 ₽</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-14 px-4 glass-card rounded-[32px] border border-white/80 space-y-3 shadow-sm">
          <Heart className="w-12 h-12 text-[#7F9E7D] mx-auto" />
          <h3 className="text-base font-bold text-[#142C12]">
            В избранном пока пусто
          </h3>
          <p className="text-xs text-[#5D7B5C] max-w-xs mx-auto">
            Нажимайте на сердечко в карточках товаров или сканируйте продукты в магазине, чтобы следить за скидками.
          </p>
          <button
            onClick={onOpenScanner}
            className="px-5 py-2.5 rounded-full bg-[#4A7A45] text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs hover:bg-[#396335] transition-all"
          >
            <ScanBarcode className="w-4 h-4" />
            <span>Сканировать товар</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer glass-card glass-card-hover rounded-2xl p-3 border border-white/80 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/40 shrink-0 border border-white/60">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <div className="text-[10px] text-[#698867] font-semibold uppercase">
                    {product.brand}
                  </div>
                  <h4 className="text-sm font-bold text-[#142C12] group-hover:text-[#3B6636] transition-colors">
                    {product.name}
                  </h4>
                  <div className="text-xs text-[#597857]">
                    {product.currentStore.name} · {product.currentStore.price} ₽
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  className="w-9 h-9 rounded-full glass-pill hover:bg-rose-50 text-[#71906F] hover:text-rose-500 flex items-center justify-center transition-all shadow-xs"
                  title="Удалить из избранного"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="w-9 h-9 rounded-full glass-pill group-hover:bg-[#4A7A45] group-hover:text-white flex items-center justify-center transition-all text-[#294B27] shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
