import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ScanBarcode,
  Sparkles,
  Star,
  Heart,
  TrendingDown,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { Product } from '../data/products';

interface HomeViewProps {
  products: Product[];
  selectedCity: string;
  onOpenCityModal: () => void;
  onOpenSearch: (initialQuery?: string) => void;
  onOpenScanner: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onOpenProfile: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  selectedCity,
  onOpenCityModal,
  onOpenSearch,
  onOpenScanner,
  onSelectProduct,
  onToggleFavorite,
  onOpenProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'discounts' | 'popular' | 'dairy'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'discounts') return p.isDiscount || p.priceDifferencePercent < -5;
    if (activeTab === 'popular') return p.isPopular || p.rating >= 4.7;
    if (activeTab === 'dairy') return p.category === 'Молочка';
    return true;
  });

  const featuredProduct = products.find((p) => p.id === 'moloko-domik') || products[0];

  return (
    <div className="space-y-4 pb-28">
      {/* Top Header: City & Profile Glass Pills */}
      <header className="flex items-center justify-between pt-1">
        <button
          onClick={onOpenCityModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill hover:bg-white/80 transition-all text-left shadow-xs group"
        >
          <MapPin className="w-3.5 h-3.5 text-[#3E6C38] shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-[#1E3A1C]">{selectedCity}</span>
          <span className="text-[10px] text-[#698567]">▼</span>
        </button>

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1 pl-3 rounded-full glass-pill hover:bg-white/80 transition-all shadow-xs"
        >
          <span className="text-xs font-bold text-[#1E3A1C]">Ярослав</span>
          <div className="relative w-8 h-8 rounded-full bg-linear-to-tr from-[#386134] to-[#4F8349] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            Я
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#D8FF4F] ring-2 ring-white" />
          </div>
        </button>
      </header>

      {/* Greeting Title */}
      <div className="pt-1">
        <h1 className="text-2xl font-black text-[#142A13] tracking-tight leading-tight">
          Привет, Покупатель 🌱
        </h1>
        <p className="text-xs text-[#526D50] mt-0.5 font-medium">
          Сканируй товар у полки и сразу знай, брать или нет
        </p>
      </div>

      {/* Search Input (Frosted Glass Capsule matching Reference) */}
      <div
        onClick={() => onOpenSearch()}
        className="w-full h-12 px-4 rounded-full glass-input shadow-xs flex items-center gap-3 cursor-pointer hover:bg-white/70 transition-all group"
      >
        <Search className="w-4 h-4 text-[#5A7B57] group-hover:text-[#234221] transition-colors" />
        <span className="text-xs sm:text-sm text-[#5B7759] font-medium">
          Поиск товаров: молоко, сыр, бананы, шоколад...
        </span>
      </div>

      {/* Main Glass Hero CTA: Сканируй товар и узнай всё */}
      <div className="relative overflow-hidden rounded-3xl glass-card-dark text-white p-5 sm:p-6 shadow-[0_16px_40px_rgba(10,28,12,0.35)] border border-white/20">
        {/* Soft Ambient glowing glass orbs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#D8FF4F]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#4E8348]/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#D8FF4F] text-[11px] font-bold tracking-wide border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Scanly AI Assistant
            </span>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#D8FF4F] animate-ping" />
              <span>140K+ товаров</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1.5 leading-snug">
            Сканируй упаковку <br />
            <span className="text-[#D8FF4F]">и прими решение за 3 секунды</span>
          </h2>

          <p className="text-xs text-emerald-100/90 max-w-sm mb-5 leading-relaxed font-normal">
            Наведи камеру на штрихкод: узнай честную AI-сводку мнений, состав и сравни цены в Пятёрочке, Магните, Ленте и ВкусВилле.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={onOpenScanner}
              className="h-12 px-5 rounded-2xl bg-linear-to-r from-[#D8FF4F] to-[#c7f23a] text-[#071304] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(216,255,79,0.5)] active:scale-[0.98] transition-all shadow-md group"
            >
              <ScanBarcode className="w-4 h-4 text-[#071304] group-hover:scale-110 transition-transform" />
              <span>Сканировать штрихкод</span>
            </button>

            <button
              onClick={() => onSelectProduct(featuredProduct)}
              className="h-12 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all border border-white/20 backdrop-blur-md"
            >
              <span>Пример (Молоко 89 ₽)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8FF4F]" />
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Filter Pills (Matching "Today / Upcoming / Completed" in Reference Screen 3) */}
      <div className="p-1 rounded-2xl glass-card flex items-center gap-1 overflow-x-auto no-scrollbar shadow-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-center ${
            activeTab === 'all'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#4D674A] hover:text-[#1F3D1C]'
          }`}
        >
          Все товары
        </button>

        <button
          onClick={() => setActiveTab('discounts')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'discounts'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#4D674A] hover:text-[#1F3D1C]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Скидки</span>
        </button>

        <button
          onClick={() => setActiveTab('popular')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'popular'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#4D674A] hover:text-[#1F3D1C]'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Топ</span>
        </button>

        <button
          onClick={() => setActiveTab('dairy')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-center ${
            activeTab === 'dairy'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#4D674A] hover:text-[#1F3D1C]'
          }`}
        >
          Молочка
        </button>
      </div>

      {/* Spotlight: Находка дня в стиле "Plant Care Today" из референса */}
      <div
        onClick={() => onSelectProduct(products[3])} // Ritter Sport
        className="cursor-pointer p-4 rounded-3xl glass-card glass-card-hover flex items-center justify-between gap-3 shadow-md group"
      >
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-2xl overflow-hidden shrink-0 border border-white/80 bg-white/70 shadow-xs flex items-center justify-center p-1">
            <img
              src={products[3].image}
              alt={products[3].name}
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-[#4A7A45] text-white text-[9px] font-black uppercase tracking-wider">
                Скидка −17%
              </span>
              <span className="text-[11px] text-[#698466] font-medium">Пятёрочка</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#142913] mt-0.5 group-hover:text-[#376632] transition-colors">
              {products[3].name}
            </div>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span className="font-black text-[#1E3B1B] text-sm tabular-nums">
                {products[3].currentStore.price} ₽
              </span>
              <span className="line-through text-[#869E83] text-xs tabular-nums">179 ₽</span>
              <span className="text-[10px] text-[#3D6938] font-bold">· экономия 30 ₽</span>
            </div>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#2D5029] group-hover:bg-[#4A7A45] group-hover:text-white transition-all shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Section: Популярное рядом (Cards styled like "My Plants" from reference) */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-black text-[#162C15] tracking-tight">
              Популярное рядом
            </h3>
            <p className="text-xs text-[#5D7A5B]">
              Свежие цены в супермаркетах вашего района
            </p>
          </div>
          <button
            onClick={() => onOpenSearch()}
            className="text-xs font-bold text-[#3B6636] hover:text-[#183116] flex items-center gap-0.5"
          >
            <span>Все</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards Grid in Frosted Glass */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredProducts.map((product) => {
            const isFav = product.isFavorite;
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer glass-card glass-card-hover rounded-3xl p-3.5 shadow-sm flex flex-col justify-between"
              >
                {/* Image and Inset Frosted Badges */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white/40 mb-3 border border-white/60">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {/* Favorite Button (Glass circle) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product.id);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs ${
                      isFav
                        ? 'bg-rose-500 text-white'
                        : 'glass-pill text-[#2E4F2B] hover:bg-white hover:text-rose-500'
                    }`}
                    aria-label="В избранное"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Frosted Savings / Rating Pill */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    {product.priceDifferencePercent < 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-[#142A13]/85 backdrop-blur-md text-[#D8FF4F] text-[10px] font-black flex items-center gap-1 border border-white/10">
                        <TrendingDown className="w-3 h-3" />
                        {product.priceDifferencePercent}%
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-lg glass-pill text-[#193217] text-[10px] font-black flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="text-[10px] font-bold text-[#6D8A6A] uppercase tracking-wider mb-0.5">
                    {product.brand} · {product.category}
                  </div>
                  <h4 className="text-sm font-bold text-[#142A13] leading-snug line-clamp-1 group-hover:text-[#386733] transition-colors">
                    {product.name}
                  </h4>
                  <div className="text-xs text-[#5D7A5B] mb-3">
                    {product.volumeWeight}
                  </div>

                  {/* Store & Price Footer (Glass Inset Row) */}
                  <div className="pt-2.5 border-t border-white/60 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-[#698767] font-medium">
                        {product.currentStore.name} · {product.currentStore.timestamp}
                      </div>
                      <div className="text-xl font-black text-[#142C12] tabular-nums">
                        {product.currentStore.price} ₽
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#1E3B1C] glass-pill group-hover:bg-[#4A7A45] group-hover:text-white px-2.5 py-1.5 rounded-xl transition-all shadow-xs">
                      Обзор →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Community Banner in Frosted Glass */}
      <div className="p-4 rounded-3xl glass-card flex items-center gap-3 shadow-xs">
        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#4A7A45] to-[#2E522B] text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#456343]">
          <strong className="text-[#152B14] block font-bold">
            Честные отзывы без накруток
          </strong>
          Каждый отзыв содержит цену и чек реальной покупки товара.
        </div>
      </div>
    </div>
  );
};
