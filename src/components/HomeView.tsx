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
    if (activeTab === 'popular') return p.rating >= 4.7 || p.isPopular;
    if (activeTab === 'dairy') return p.category === 'Молочка';
    return true;
  });

  const featuredProduct = products.find((p) => p.id === 'moloko-domik') || products[0];
  const dealOfTheDay = products.find((p) => p.id === 'ritter-sport') || products[3] || products[0];

  return (
    <div className="space-y-5 pb-28">
      {/* Top Header: City & Profile Glass Pills */}
      <header className="flex items-center justify-between pt-1">
        <button
          onClick={onOpenCityModal}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-pill hover:bg-white/90 active:scale-95 transition-all text-left shadow-xs group"
        >
          <MapPin className="w-4 h-4 text-[#2E6028] shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-extrabold text-[#0E260D]">{selectedCity}</span>
          <span className="text-[10px] text-[#4F754A] font-bold">▼</span>
        </button>

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1 pl-3.5 rounded-full glass-pill hover:bg-white/90 active:scale-95 transition-all shadow-xs"
        >
          <span className="text-xs font-extrabold text-[#0E260D]">Ярослав</span>
          <div className="relative w-8 h-8 rounded-full bg-linear-to-tr from-[#2A5626] to-[#457C40] text-white flex items-center justify-center font-black text-xs shadow-xs">
            Я
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#D8FF4F] ring-2 ring-white" />
          </div>
        </button>
      </header>

      {/* Greeting Title with Strong Visual Hierarchy */}
      <div className="pt-0.5 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#071707] tracking-tight leading-tight">
          Привет, Покупатель 🌱
        </h1>
        <p className="text-sm text-[#274426] font-medium leading-normal">
          Сканируй товар у полки и сразу знай, брать или нет
        </p>
      </div>

      {/* Search Input (Frosted Glass Capsule) */}
      <div
        onClick={() => onOpenSearch()}
        className="w-full h-13 px-4.5 rounded-full glass-input shadow-xs flex items-center gap-3 cursor-pointer hover:bg-white/90 active:scale-[0.99] transition-all group"
      >
        <Search className="w-4.5 h-4.5 text-[#305C2B] group-hover:text-[#0C240B] transition-colors shrink-0" />
        <span className="text-sm text-[#385936] font-medium truncate">
          Поиск товаров: молоко, сыр, бананы, шоколад...
        </span>
      </div>

      {/* Main Glass Hero CTA: Сканируй товар и узнай всё */}
      <div className="relative overflow-hidden rounded-[32px] glass-card-dark text-white p-5 sm:p-7 shadow-[0_18px_44px_rgba(4,16,6,0.42)] border border-white/20">
        {/* Soft Ambient glowing glass orbs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#D8FF4F]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#3F7339]/40 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#D8FF4F] text-xs font-extrabold tracking-wide border border-white/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Scanly AI Assistant
            </span>

            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#D8FF4F] animate-pulse" />
              <span>140K+ товаров в базе</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2.5 leading-tight">
            Сканируй упаковку <br />
            <span className="text-[#D8FF4F]">и реши за 3 секунды</span>
          </h2>

          <p className="text-sm text-emerald-100/95 max-w-sm mb-6 leading-relaxed font-normal">
            Наведи камеру на штрихкод: узнай честную AI-сводку мнений, состав и сравни цены в Пятёрочке, Магните, Ленте и ВкусВилле.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenScanner}
              className="h-13.5 px-6 rounded-2xl bg-linear-to-r from-[#D8FF4F] to-[#b7ed26] text-[#071304] font-black text-sm flex items-center justify-center gap-2.5 hover:shadow-[0_0_28px_rgba(216,255,79,0.55)] active:scale-[0.98] transition-all shadow-md group"
            >
              <ScanBarcode className="w-5 h-5 text-[#071304] group-hover:scale-110 transition-transform" />
              <span>Сканировать штрихкод</span>
            </button>

            <button
              onClick={() => onSelectProduct(featuredProduct)}
              className="h-12 px-4 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/25 backdrop-blur-md shadow-xs"
            >
              <span>Попробовать образец (Молоко)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8FF4F]" />
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Filter Pills with Comfortable Tap Targets */}
      <div className="p-1.5 rounded-2xl glass-card flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all text-center ${
            activeTab === 'all'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#244522] hover:text-[#071707]'
          }`}
        >
          Все товары
        </button>

        <button
          onClick={() => setActiveTab('discounts')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'discounts'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#244522] hover:text-[#071707]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span>Скидки</span>
        </button>

        <button
          onClick={() => setActiveTab('popular')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'popular'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#244522] hover:text-[#071707]'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Топ</span>
        </button>

        <button
          onClick={() => setActiveTab('dairy')}
          className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all text-center ${
            activeTab === 'dairy'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#244522] hover:text-[#071707]'
          }`}
        >
          Молочка
        </button>
      </div>

      {/* Spotlight: Находка дня */}
      <div
        onClick={() => onSelectProduct(dealOfTheDay)}
        className="cursor-pointer p-4 sm:p-5 rounded-[28px] glass-card glass-card-hover flex items-center justify-between gap-3 shadow-md border border-white/90 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/95 bg-white/80 shadow-xs flex items-center justify-center p-1">
            <img
              src={dealOfTheDay.image}
              alt={dealOfTheDay.name}
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#244E20] text-white text-[10px] font-black uppercase tracking-wider">
                Скидка −17%
              </span>
              <span className="text-xs text-[#30532C] font-bold">{dealOfTheDay.currentStore.name}</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#071707] group-hover:text-[#255221] transition-colors leading-snug">
              {dealOfTheDay.name}
            </div>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="font-black text-[#071707] text-lg sm:text-xl tabular-nums">
                {dealOfTheDay.currentStore.price} ₽
              </span>
              <span className="line-through text-[#668763] text-xs font-semibold tabular-nums">179 ₽</span>
              <span className="text-xs text-[#255221] font-extrabold">· выгода 30 ₽</span>
            </div>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-[#1E3F1C] group-hover:bg-[#254F22] group-hover:text-white transition-all shrink-0 shadow-xs">
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>

      {/* Section: Популярное рядом */}
      <section className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xl font-black text-[#071707] tracking-tight">
              Популярное рядом
            </h3>
            <p className="text-xs text-[#2E4F2C] font-semibold">
              Свежие цены в супермаркетах вашего района
            </p>
          </div>
          <button
            onClick={() => onOpenSearch()}
            className="text-xs font-bold text-[#254F22] hover:text-[#071707] flex items-center gap-0.5 px-2.5 py-1 rounded-full glass-pill"
          >
            <span>Все ({filteredProducts.length})</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Product Cards Grid with spacious mobile hierarchy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((product) => {
            const isFav = product.isFavorite;
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer glass-card glass-card-hover rounded-[28px] p-4 sm:p-5 shadow-sm flex flex-col justify-between border border-white/90"
              >
                {/* Image and Inset Frosted Badges */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white/60 mb-3.5 border border-white/80 shadow-xs">
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
                    className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs ${
                      isFav
                        ? 'bg-rose-500 text-white'
                        : 'glass-pill text-[#122D11] hover:bg-white hover:text-rose-500'
                    }`}
                    aria-label="В избранное"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Frosted Savings / Rating Pill */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    {product.priceDifferencePercent < 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-[#071807]/90 backdrop-blur-md text-[#D8FF4F] text-xs font-black flex items-center gap-1 border border-white/15">
                        <TrendingDown className="w-3 h-3" />
                        {product.priceDifferencePercent}%
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-lg glass-pill text-[#071707] text-xs font-black flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </span>
                  </div>
                </div>

                {/* Details with strict typography hierarchy */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#355733] uppercase tracking-wider">
                    {product.brand} · {product.category}
                  </div>

                  <h4 className="text-base font-extrabold text-[#071707] leading-snug line-clamp-2 group-hover:text-[#255221] transition-colors">
                    {product.name}
                  </h4>

                  <div className="text-xs text-[#355733] font-medium">
                    {product.volumeWeight}
                  </div>

                  {/* Store & Price Footer */}
                  <div className="pt-3.5 mt-2 border-t border-white/70 flex items-end justify-between">
                    <div>
                      <div className="text-xs text-[#355733] font-bold">
                        {product.currentStore.name} · {product.currentStore.timestamp}
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-[#071707] tabular-nums mt-0.5">
                        {product.currentStore.price} ₽
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-[#071707] glass-pill group-hover:bg-[#254F22] group-hover:text-white px-3.5 py-2 rounded-xl transition-all shadow-xs">
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
      <div className="p-4 sm:p-5 rounded-3xl glass-card flex items-center gap-3.5 shadow-xs border border-white/90">
        <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#386733] to-[#20401E] text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-[#274426] leading-relaxed">
          <strong className="text-[#071707] block font-bold text-sm">
            Честные отзывы без накруток
          </strong>
          Каждый отзыв содержит подтвержденную цену и чек реальной покупки товара.
        </div>
      </div>
    </div>
  );
};
