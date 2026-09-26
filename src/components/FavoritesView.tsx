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
    <div className="space-y-4.5 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#355733] uppercase tracking-wider">
            Отслеживание цен
          </span>
          <h2 className="text-2xl font-black text-[#071707] tracking-tight">
            Избранные товары
          </h2>
        </div>

        <span className="px-3.5 py-1.5 rounded-full glass-pill text-xs font-extrabold text-[#071707] shadow-xs">
          {favoriteProducts.length} сохранено
        </span>
      </div>

      {/* Price Alert Simulation Notification Banner (Glass Card) */}
      <div className="p-4 sm:p-5 rounded-3xl glass-card-dark text-white shadow-md border border-white/20 relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#D8FF4F] text-[#071304] flex items-center justify-center shrink-0 shadow-xs">
            <Bell className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[#D8FF4F]">
                Снижение цены обнаружено
              </span>
              <span className="text-xs font-semibold text-emerald-200">Сегодня</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
              Шоколад <strong>Ritter Sport Марципан</strong> подешевел в Пятёрочке! Было 179 ₽ → стало <strong className="text-white">149 ₽</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16 px-4 glass-card rounded-[32px] border border-white/90 space-y-3.5 shadow-sm">
          <Heart className="w-12 h-12 text-[#4A7547] mx-auto" />
          <h3 className="text-lg font-extrabold text-[#071707]">
            В избранном пока пусто
          </h3>
          <p className="text-xs sm:text-sm text-[#355733] max-w-xs mx-auto leading-relaxed">
            Нажимайте на сердечко в карточках товаров или сканируйте продукты в магазине, чтобы следить за скидками.
          </p>
          <button
            onClick={onOpenScanner}
            className="px-6 py-3 rounded-full bg-[#254F22] text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs hover:bg-[#1A3A17] transition-all"
          >
            <ScanBarcode className="w-4 h-4" />
            <span>Сканировать товар</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer glass-card glass-card-hover rounded-2xl p-4 border border-white/90 shadow-xs flex items-center justify-between gap-3.5"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-18 h-18 rounded-2xl overflow-hidden bg-white/60 shrink-0 border border-white/80 shadow-xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#355733] font-bold uppercase tracking-wider">
                    {product.brand} · {product.category}
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#071707] group-hover:text-[#254F22] transition-colors line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="text-xs text-[#355733] font-semibold">
                    {product.currentStore.name} · <strong className="text-[#071707]">{product.currentStore.price} ₽</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  className="w-10 h-10 rounded-full glass-pill hover:bg-rose-50 text-[#355733] hover:text-rose-500 flex items-center justify-center transition-all shadow-xs"
                  title="Удалить из избранного"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="w-10 h-10 rounded-full glass-pill group-hover:bg-[#254F22] group-hover:text-white flex items-center justify-center transition-all text-[#1C3A19] shadow-xs">
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
