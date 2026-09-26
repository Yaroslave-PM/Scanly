import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Sparkles,
  TrendingDown,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  MessageCircle,
  Camera,
  Info,
  Send,
} from 'lucide-react';
import { Product, Review } from '../data/products';

interface ProductCardViewProps {
  product: Product;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenWriteReview: () => void;
  onOpenMap: () => void;
}

export const ProductCardView: React.FC<ProductCardViewProps> = ({
  product,
  onBack,
  onToggleFavorite,
  onOpenWriteReview,
  onOpenMap,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'prices' | 'reviews' | 'nutrition'>('overview');
  const [reviewsFilter, setReviewsFilter] = useState<'all' | 'photo' | 'verified'>('all');
  const [userLikedReviews, setUserLikedReviews] = useState<Record<string, boolean>>({});
  const [localReviews, setLocalReviews] = useState<Review[]>(product.reviews);
  const [customQuestion, setCustomQuestion] = useState('');
  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string }>>([
    {
      q: 'Подходит ли для капучино?',
      a: 'Да! За счет жирности 3,2% и содержания белка 3,0 г молоко отлично взбивается в плотную шелковистую пенку в ручном капучинаторе и рожковых кофемашинах.',
    },
  ]);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const isFav = product.isFavorite;

  const handleToggleLikeReview = (reviewId: string) => {
    setUserLikedReviews((prev) => {
      const current = !!prev[reviewId];
      const updated = !current;
      setLocalReviews((rList) =>
        rList.map((r) =>
          r.id === reviewId
            ? { ...r, likes: current ? r.likes - 1 : r.likes + 1 }
            : r
        )
      );
      return { ...prev, [reviewId]: updated };
    });
  };

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const q = customQuestion.trim();
    setCustomQuestion('');
    setIsAskingAi(true);

    setTimeout(() => {
      let answer = `На основе анализа отзывов и состава: продукт полностью безопасен и соответствует заявленным стандартам ГОСТ. Большинство покупателей считают его одной из лучших покупок в категории.`;
      if (q.toLowerCase().includes('хранить') || q.toLowerCase().includes('срок')) {
        answer = 'После вскрытия упаковки производитель рекомендует хранить продукт в холодильнике не более 3 суток при температуре от +2°C до +6°C.';
      } else if (q.toLowerCase().includes('блин') || q.toLowerCase().includes('тест')) {
        answer = 'Для блинного теста подходит превосходно — тесто получается эластичным, блины не рвутся и имеют приятный сливочно-золотистый цвет.';
      } else if (q.toLowerCase().includes('сахар') || q.toLowerCase().includes('состав')) {
        answer = 'В составе только нормализованное молоко высшего сорта. Добавленного сахара, растительных жиров и консервантов не обнаружено.';
      }

      setAiAnswers((prev) => [{ q, a: answer }, ...prev]);
      setIsAskingAi(false);
    }, 500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Нашел в Scanly: ${product.name} за ${product.currentStore.price} ₽ в ${product.currentStore.name}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${product.name} за ${product.currentStore.price} ₽ в Scanly`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const filteredReviews = localReviews.filter((r) => {
    if (reviewsFilter === 'photo') return !!r.photos && r.photos.length > 0;
    if (reviewsFilter === 'verified') return r.isVerifiedBuyer;
    return true;
  });

  return (
    <div className="space-y-5 pb-32 animate-fade-in">
      {/* Top Floating App Bar (Glass) */}
      <div className="sticky top-0 z-30 flex items-center justify-between p-3.5 -mx-4 px-4 glass-dock border-b border-white/70 shadow-xs">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-[#0E260D] hover:bg-white active:scale-95 transition-all shadow-xs"
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
        </button>

        <div className="text-center px-2 truncate max-w-[220px]">
          <span className="text-xs font-black text-[#071707] truncate block">
            {product.name}
          </span>
          <span className="text-[11px] font-bold text-[#355733]">
            {product.brand} · {product.volumeWeight}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-[#1E3F1C] hover:bg-white active:scale-95 transition-all shadow-xs"
            title="Поделиться"
          >
            <Share2 className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>

          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-xs ${
              isFav
                ? 'bg-rose-500 text-white'
                : 'glass-pill text-[#1E3F1C] hover:bg-white'
            }`}
            aria-label="В избранное"
          >
            <Heart className={`w-4.5 h-4.5 stroke-[2.2] ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {copiedShare && (
        <div className="p-3 rounded-2xl glass-card-dark text-[#D8FF4F] text-xs font-extrabold text-center border border-white/20 shadow-md">
          Ссылка скопирована в буфер обмена!
        </div>
      )}

      {/* Main Product Hero Card (Glassmorphic Surface matching Reference Screen 2) */}
      <div className="glass-card rounded-[32px] p-5 sm:p-6 shadow-md border border-white/90">
        {/* Large Product Photography */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white/70 mb-4.5 border border-white/80 shadow-xs flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Barcode badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full glass-card-dark text-white text-xs font-mono font-medium flex items-center gap-1.5 border border-white/20 shadow-xs">
            <span>Штрихкод: {product.barcode}</span>
          </div>

          {/* Savings Badge */}
          {product.priceDifferencePercent < 0 && (
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-linear-to-r from-[#0C240B] to-[#1E451B] text-[#D8FF4F] text-xs font-black flex items-center gap-1.5 shadow-lg border border-white/20">
              <TrendingDown className="w-4 h-4" />
              <span>{product.priceDifferencePercent}% к средней цене</span>
            </div>
          )}
        </div>

        {/* Product Identity */}
        <div className="space-y-1.5 mb-4">
          <div className="text-xs font-bold text-[#355733] uppercase tracking-wider">
            {product.brand} · {product.category}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#071707] tracking-tight leading-tight">
            {product.name}
          </h2>
          <div className="text-sm text-[#274426] font-semibold">
            {product.volumeWeight}
          </div>
        </div>

        {/* Rating Row (Glass Inset) */}
        <div className="flex items-center gap-3 py-3 px-4 rounded-2xl glass-pill mb-4.5 shadow-xs">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4.5 h-4.5 ${
                    s <= Math.round(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-base font-black text-[#071707] tabular-nums">
              {product.rating}
            </span>
          </div>

          <span className="text-[#6B8C67] font-bold">·</span>

          <span className="text-xs sm:text-sm font-bold text-[#274426]">
            {product.reviewCount} отзывов покупателей
          </span>
        </div>

        {/* Current Store Anchor Banner */}
        <div className="p-5 sm:p-6 rounded-3xl glass-card-dark text-white flex items-center justify-between border border-white/20 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-200 font-extrabold">
                {product.currentStore.name}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#D8FF4F] text-[10px] font-black border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8FF4F] animate-pulse" />
                {product.currentStore.timestamp}
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-[#D8FF4F] tracking-tight tabular-nums">
              {product.currentStore.price} ₽
            </div>

            <div className="text-xs text-emerald-100 font-medium">
              Средняя цена в городе: <strong className="text-white font-bold">{product.averagePrice} ₽</strong>
            </div>
          </div>

          <button
            onClick={onOpenMap}
            className="h-12 px-4.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/20 backdrop-blur-md shrink-0 shadow-xs"
          >
            <MapPin className="w-4 h-4 text-[#D8FF4F]" />
            <span>На карте</span>
          </button>
        </div>
      </div>

      {/* Decision Tip Banner */}
      <div className="p-4 sm:p-5 rounded-3xl glass-card flex items-start sm:items-center gap-3.5 border border-white/90 shadow-xs">
        <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#254F22] to-[#122A10] text-[#D8FF4F] flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-[#071707] leading-relaxed">
          <strong className="block text-sm font-extrabold text-[#071707] mb-0.5">
            Решение Scanly:
          </strong>
          {product.cheapestStore.name === product.currentStore.name
            ? `Вы в самом выгодном магазине! Здесь экономия ${product.cheapestStore.savings} ₽ по сравнению с другими сетями.`
            : `В магазине ${product.cheapestStore.name} можно купить дешевле на ${product.cheapestStore.savings} ₽.`}
        </div>
      </div>

      {/* Segmented Sub-tab Navigation */}
      <div className="p-1.5 rounded-2xl glass-card flex items-center gap-1.5 shadow-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all text-center ${
            activeTab === 'overview'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#244522] hover:text-[#071707]'
          }`}
        >
          Обзор & AI
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all text-center ${
            activeTab === 'prices'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#244522] hover:text-[#071707]'
          }`}
        >
          Цены ({product.storePrices.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all text-center ${
            activeTab === 'reviews'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#244522] hover:text-[#071707]'
          }`}
        >
          Отзывы ({localReviews.length})
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all text-center ${
            activeTab === 'nutrition'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#244522] hover:text-[#071707]'
          }`}
        >
          БЖУ & Состав
        </button>
      </div>

      {/* Tab 1: Overview & AI Summary */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="glass-card rounded-[32px] p-5 sm:p-6 border border-white/90 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#254F22] to-[#122A10] text-[#D8FF4F] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#071707]">
                    AI-сводка отзывов
                  </h3>
                  <div className="text-xs text-[#355733] font-bold">
                    Анализ {product.reviewCount} мнений покупателей
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#254F22] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                94% рекомендуют
              </span>
            </div>

            {/* Clear quote block */}
            <div className="glass-pill p-4 sm:p-5 rounded-2xl border border-white/90 shadow-xs">
              <p className="text-sm sm:text-base text-[#071707] leading-relaxed font-medium">
                «{product.aiSummary.summary}»
              </p>
            </div>

            {/* Pros and Cons Inset Glass Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-600/30 backdrop-blur-md space-y-2.5">
                <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-800 shrink-0" />
                  <span>Что хвалят покупатели:</span>
                </div>
                <ul className="text-xs sm:text-sm text-emerald-950 space-y-2 font-medium">
                  {product.aiSummary.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-600/30 backdrop-blur-md space-y-2.5">
                <div className="text-xs font-black text-rose-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-800 shrink-0" />
                  <span>На что жалуются:</span>
                </div>
                <ul className="text-xs sm:text-sm text-rose-950 space-y-2 font-medium">
                  {product.aiSummary.cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-rose-700 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Q&A Input */}
            <div className="pt-3 border-t border-white/70 space-y-3">
              <div className="text-xs font-black text-[#071707] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#2E6028]" />
                <span>Спросить у AI о продукте:</span>
              </div>

              <form onSubmit={handleAskAi} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Например: Подойдет ли для капучино?"
                  className="flex-1 h-11 px-4 rounded-full glass-input text-xs sm:text-sm font-medium text-[#071707] placeholder:text-[#4A6E48] focus:outline-none focus:border-[#254F22]"
                />
                <button
                  type="submit"
                  disabled={isAskingAi || !customQuestion.trim()}
                  className="h-11 px-5 rounded-full bg-[#254F22] hover:bg-[#1A3A17] text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Спросить</span>
                </button>
              </form>

              {/* Answers feed */}
              <div className="space-y-2.5">
                {aiAnswers.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl glass-pill text-xs sm:text-sm space-y-1.5 shadow-xs border border-white/90">
                    <div className="font-extrabold text-[#071707]">❓ {item.q}</div>
                    <div className="text-[#1D3B1B] leading-relaxed font-medium">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prices in Offline Grocery Chains */}
      {activeTab === 'prices' && (
        <div className="space-y-3.5">
          <div className="glass-card rounded-[32px] p-5 sm:p-6 border border-white/90 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#071707]">
                  Где купить дешевле
                </h3>
                <p className="text-xs text-[#355733] font-semibold">
                  Сравнение цен в супермаркетах рядом с вами
                </p>
              </div>
              <button
                onClick={onOpenMap}
                className="text-xs font-bold text-[#254F22] hover:text-[#071707] flex items-center gap-1 px-3 py-1.5 rounded-full glass-pill"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>На карте</span>
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {product.storePrices.map((sp) => {
                const isCurrent = sp.isCurrent;
                const isCheapest = sp.isCheapest;

                return (
                  <div
                    key={sp.store}
                    className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                      isCheapest
                        ? 'bg-emerald-500/15 border border-emerald-600/35 shadow-xs'
                        : isCurrent
                        ? 'glass-card border border-white/95 shadow-xs'
                        : 'glass-pill'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#2E6028] to-[#173615] text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {sp.store[0]}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-extrabold text-[#071707]">
                            {sp.store}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#122A10] text-white text-[10px] font-bold">
                              Сейчас здесь
                            </span>
                          )}
                          {isCheapest && (
                            <span className="px-2 py-0.5 rounded-full bg-[#D8FF4F] text-[#071304] text-[10px] font-black shadow-xs">
                              Выгодно
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#355733] flex items-center gap-2 font-semibold">
                          <span>{sp.distance}</span>
                          <span>·</span>
                          <span className="text-[#204E1E] font-bold">В наличии</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-[#071707] tabular-nums">
                        {sp.price} ₽
                      </div>
                      {sp.oldPrice && (
                        <div className="line-through text-xs font-semibold text-[#668763] tabular-nums">
                          {sp.oldPrice} ₽
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-3.5">
          <div className="glass-card rounded-[32px] p-5 sm:p-6 border border-white/90 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#071707]">
                  Отзывы покупателей
                </h3>
                <div className="text-xs text-[#355733] font-semibold">
                  {product.reviewCount} отзывов с подтвержденной покупкой
                </div>
              </div>

              <button
                onClick={onOpenWriteReview}
                className="px-4 py-2 rounded-full bg-[#254F22] hover:bg-[#1A3A17] active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>+ Написать</span>
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setReviewsFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  reviewsFilter === 'all'
                    ? 'glass-pill-active shadow-sm'
                    : 'glass-pill text-[#274426]'
                }`}
              >
                Все
              </button>

              <button
                onClick={() => setReviewsFilter('photo')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  reviewsFilter === 'photo'
                    ? 'glass-pill-active shadow-sm'
                    : 'glass-pill text-[#274426]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                С фото
              </button>

              <button
                onClick={() => setReviewsFilter('verified')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  reviewsFilter === 'verified'
                    ? 'glass-pill-active shadow-sm'
                    : 'glass-pill text-[#274426]'
                }`}
              >
                Покупатели
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-3.5 pt-1">
              {filteredReviews.map((rev) => {
                const hasLiked = userLikedReviews[rev.id];

                return (
                  <div
                    key={rev.id}
                    className="p-4 sm:p-5 rounded-2xl glass-card border border-white/90 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#254F22] to-[#122A10] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {rev.userName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm sm:text-base font-extrabold text-[#071707]">
                              {rev.userName}
                            </span>
                            {rev.userBadge && (
                              <span className="px-2 py-0.5 rounded-md bg-[#D8FF4F] text-[#071304] text-[10px] font-black">
                                {rev.userBadge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#355733] font-semibold">
                            {rev.date}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm sm:text-base font-black text-[#071707] tabular-nums">
                          {rev.pricePaid} ₽
                        </div>
                        <div className="text-xs text-[#355733] font-bold">
                          в {rev.store}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm sm:text-base text-[#071707] leading-relaxed font-normal">
                      {rev.text}
                    </p>

                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex items-center gap-2.5 pt-1">
                        {rev.photos.map((p, idx) => (
                          <div
                            key={idx}
                            className="w-20 h-20 rounded-2xl overflow-hidden bg-white/50 border border-white/90 shadow-xs"
                          >
                            <img
                              src={p}
                              alt="Фото к отзыву"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-white/60 text-xs text-[#355733]">
                      <button
                        onClick={() => handleToggleLikeReview(rev.id)}
                        className={`flex items-center gap-1.5 font-bold py-1 px-2.5 rounded-full transition-all ${
                          hasLiked ? 'bg-[#254F22] text-white shadow-xs' : 'glass-pill hover:text-[#071707]'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                        <span>Полезно ({rev.likes})</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-[#355733] font-bold">
                        <MessageCircle className="w-4 h-4" />
                        <span>{rev.commentsCount} коммент.</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Nutrition & KBJU */}
      {activeTab === 'nutrition' && (
        <div className="space-y-4">
          <div className="glass-card rounded-[32px] p-5 sm:p-6 border border-white/90 shadow-md space-y-4.5">
            <div>
              <h3 className="text-lg font-black text-[#071707]">
                Пищевая ценность и состав
              </h3>
              <div className="text-xs text-[#355733] font-bold mt-0.5">
                Показатели {product.nutrition.serving.toLowerCase()}:
              </div>
            </div>

            {/* 4 Frosted Glass Stat Tiles */}
            <div className="grid grid-cols-4 gap-2.5 text-center">
              <div className="p-3.5 sm:p-4 rounded-2xl glass-pill shadow-xs border border-white/90">
                <div className="text-[10px] sm:text-xs text-[#355733] font-bold uppercase tracking-wider">Калории</div>
                <div className="text-xl sm:text-2xl font-black text-[#071707] tabular-nums mt-1">
                  {product.nutrition.calories}
                </div>
                <div className="text-[11px] text-[#4F754A] font-semibold">ккал</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl glass-pill shadow-xs border border-white/90">
                <div className="text-[10px] sm:text-xs text-[#355733] font-bold uppercase tracking-wider">Белки</div>
                <div className="text-xl sm:text-2xl font-black text-[#071707] tabular-nums mt-1">
                  {product.nutrition.proteins}
                </div>
                <div className="text-[11px] text-[#4F754A] font-semibold">грамм</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl glass-pill shadow-xs border border-white/90">
                <div className="text-[10px] sm:text-xs text-[#355733] font-bold uppercase tracking-wider">Жиры</div>
                <div className="text-xl sm:text-2xl font-black text-[#071707] tabular-nums mt-1">
                  {product.nutrition.fats}
                </div>
                <div className="text-[11px] text-[#4F754A] font-semibold">грамм</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl glass-pill shadow-xs border border-white/90">
                <div className="text-[10px] sm:text-xs text-[#355733] font-bold uppercase tracking-wider">Углеводы</div>
                <div className="text-xl sm:text-2xl font-black text-[#071707] tabular-nums mt-1">
                  {product.nutrition.carbs}
                </div>
                <div className="text-[11px] text-[#4F754A] font-semibold">грамм</div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-black text-[#071707] uppercase tracking-wider">
                Состав продукта:
              </div>
              <p className="text-sm sm:text-base text-[#071707] leading-relaxed glass-pill p-4 sm:p-5 rounded-2xl font-medium shadow-xs border border-white/90">
                {product.ingredients}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {product.badges.map((b) => (
                <span
                  key={b}
                  className="px-3.5 py-1.5 rounded-full glass-pill text-[#071707] text-xs font-extrabold shadow-xs border border-white/90"
                >
                  ✓ {b}
                </span>
              ))}
            </div>

            <div className="p-4 rounded-2xl glass-pill flex items-start gap-3 text-xs text-[#274426] leading-relaxed shadow-xs border border-white/90">
              <Info className="w-4.5 h-4.5 text-[#254F22] shrink-0 mt-0.5" />
              <span>
                Информация собрана из базы производителей. Перед употреблением рекомендуем сверять фактический состав на упаковке в магазине.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
