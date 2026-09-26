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
    <div className="space-y-4 pb-28">
      {/* Search Header (Frosted Glass Capsule) */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-[#597956] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию, бренду или штрихкоду..."
            autoFocus
            className="w-full h-12 pl-11 pr-11 rounded-full glass-input focus:bg-white/85 focus:border-[#4A7A45] focus:ring-2 focus:ring-[#4A7A45]/30 outline-none text-xs sm:text-sm text-[#142C12] placeholder:text-[#678665] font-medium transition-all shadow-xs"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 w-7 h-7 rounded-full glass-pill flex items-center justify-center text-[#3B5D39] hover:bg-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenScanner}
              title="Сканировать камерой"
              className="absolute right-2.5 w-8 h-8 rounded-full bg-linear-to-r from-[#4A7A45] to-[#2E522B] text-white flex items-center justify-center hover:scale-105 transition-all shadow-xs"
            >
              <ScanBarcode className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips (Segmented Glass Pills) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'glass-pill-active shadow-sm'
                : 'glass-pill text-[#4E6B4C] hover:bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sorting bar & Counter */}
      <div className="flex items-center justify-between text-xs text-[#5D7A5B] px-1 font-medium">
        <span>
          Найдено: <strong className="text-[#142D13] font-bold">{filteredProducts.length}</strong> товаров
        </span>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#5D7A5B]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-bold text-[#142D13] focus:outline-none cursor-pointer"
          >
            <option value="popular">По популярности</option>
            <option value="priceAsc">Сначала дешевле</option>
            <option value="rating">Высокий рейтинг</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 px-4 glass-card rounded-3xl border border-white/80 shadow-sm">
          <Search className="w-10 h-10 text-[#7E9C7B] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#142C12] mb-1">Ничего не найдено</h3>
          <p className="text-xs text-[#5B7959] max-w-xs mx-auto mb-4">
            Попробуйте изменить поисковый запрос или отсканировать штрихкод камерой
          </p>
          <button
            onClick={onOpenScanner}
            className="px-5 py-2.5 rounded-full bg-[#4A7A45] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
          >
            <ScanBarcode className="w-4 h-4" />
            Включить сканер
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredProducts.map((product) => {
            const isFav = product.isFavorite;
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer glass-card glass-card-hover rounded-2xl p-3 border border-white/80 shadow-xs flex items-center gap-3"
              >
                {/* Product Thumbnail */}
                <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-white/40 shrink-0 border border-white/60">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {product.priceDifferencePercent < 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#132A11]/85 text-[#D8FF4F] text-[9px] font-black">
                      {product.priceDifferencePercent}%
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#6D8C6B] uppercase tracking-wider">
                    <span>{product.brand}</span>
                    <span>·</span>
                    <span>{product.category}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[#142C12] truncate group-hover:text-[#3B6636] transition-colors">
                    {product.name}
                  </h4>

                  <div className="text-[11px] text-[#597857] truncate mb-1">
                    {product.volumeWeight}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="flex items-center gap-1 text-[#142C12] font-black">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </span>
                    <span className="text-[#84A282]">·</span>
                    <span className="text-[#597857]">{product.reviewCount} отзывов</span>
                  </div>
                </div>

                {/* Price and Favorite */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product.id);
                    }}
                    className="p-1 text-[#789676] hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="text-right">
                    <div className="text-[10px] text-[#698767] font-medium">
                      {product.currentStore.name}
                    </div>
                    <div className="text-base font-black text-[#142C12] tabular-nums">
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
