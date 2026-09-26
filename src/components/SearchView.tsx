import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Star,
  Heart,
  TrendingDown,
  ScanBarcode,
  ArrowUpDown,
} from 'lucide-react';
import { Product } from '../data/products';

interface SearchViewProps {
  products: Product[];
  initialQuery?: string;
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onOpenScanner: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  products,
  initialQuery = '',
  onSelectProduct,
  onToggleFavorite,
  onOpenScanner,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'rating'>('popular');

  const categories = ['Все', 'Молочка', 'Фрукты', 'Сладости', 'Бакалея'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesQuery =
          !query.trim() ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.barcode.includes(query.trim());

        const matchesCat =
          selectedCategory === 'Все' || p.category === selectedCategory;

        return matchesQuery && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') {
          return a.currentStore.price - b.currentStore.price;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return b.reviewCount - a.reviewCount;
      });
  }, [products, query, selectedCategory, sortBy]);

  return (
    <div className="space-y-4.5 pb-28">
      {/* Search Header (Frosted Glass Capsule) */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4.5 h-4.5 text-[#305C2B] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию, бренду или штрихкоду..."
            autoFocus
            className="w-full h-13 pl-12 pr-12 rounded-full glass-input focus:bg-white focus:border-[#254F22] focus:ring-2 focus:ring-[#254F22]/25 outline-none text-sm text-[#071707] placeholder:text-[#4A6E48] font-medium transition-all shadow-xs"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#254F22] hover:bg-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenScanner}
              title="Сканировать камерой"
              className="absolute right-2.5 w-9 h-9 rounded-full bg-linear-to-r from-[#254F22] to-[#122A10] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs"
            >
              <ScanBarcode className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips (Segmented Glass Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'glass-pill-active shadow-sm'
                : 'glass-pill text-[#244522] hover:bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sorting bar & Counter with strong legibility */}
      <div className="flex items-center justify-between text-xs text-[#355733] px-1 font-semibold">
        <span>
          Найдено: <strong className="text-[#071707] font-black">{filteredProducts.length}</strong> товаров
        </span>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#254F22]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-extrabold text-[#071707] focus:outline-none cursor-pointer"
          >
            <option value="popular">По популярности</option>
            <option value="priceAsc">Сначала дешевле</option>
            <option value="rating">Высокий рейтинг</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-14 px-4 glass-card rounded-[32px] border border-white/90 shadow-sm space-y-3">
          <Search className="w-12 h-12 text-[#4A7547] mx-auto mb-2" />
          <h3 className="text-base font-extrabold text-[#071707]">Ничего не найдено</h3>
          <p className="text-xs text-[#355733] max-w-xs mx-auto">
            Попробуйте изменить поисковый запрос или отсканировать штрихкод камерой
          </p>
          <button
            onClick={onOpenScanner}
            className="px-6 py-2.5 rounded-full bg-[#254F22] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs hover:bg-[#1A3A17]"
          >
            <ScanBarcode className="w-4 h-4" />
            Включить сканер
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const isFav = product.isFavorite;
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer glass-card glass-card-hover rounded-2xl p-3.5 sm:p-4 border border-white/90 shadow-xs flex items-center gap-3.5"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/60 shrink-0 border border-white/80 shadow-xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {product.priceDifferencePercent < 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#071807]/90 text-[#D8FF4F] text-[10px] font-black">
                      {product.priceDifferencePercent}%
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="text-[11px] font-bold text-[#355733] uppercase tracking-wider">
                    {product.brand} · {product.category}
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-[#071707] truncate group-hover:text-[#254F22] transition-colors">
                    {product.name}
                  </h4>

                  <div className="text-xs text-[#355733] font-medium">
                    {product.volumeWeight}
                  </div>

                  <div className="flex items-center gap-2 text-xs pt-0.5">
                    <span className="flex items-center gap-1 text-[#071707] font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </span>
                    <span className="text-[#6B8C67]">·</span>
                    <span className="text-[#355733] font-semibold">{product.reviewCount} отзывов</span>
                  </div>
                </div>

                {/* Price and Favorite */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0 pl-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product.id);
                    }}
                    className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#355733] hover:text-rose-500 hover:bg-white transition-all shadow-xs"
                    aria-label="В избранное"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="text-right">
                    <div className="text-xs text-[#355733] font-bold">
                      {product.currentStore.name}
                    </div>
                    <div className="text-lg sm:text-xl font-black text-[#071707] tabular-nums">
                      {product.currentStore.price} ₽
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
