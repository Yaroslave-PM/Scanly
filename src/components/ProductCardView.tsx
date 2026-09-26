import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Sparkles,
  TrendingDown,
  Store,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  MessageCircle,
  Camera,
  ChevronRight,
  Info,
  Send,
  Flame,
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
      a: 'Да! За счет жирности 3,2% и содержания белка 3,0 г молоко отлично взбивается в густую шелковистую пенку в ручном капучинаторе и рожковых кофемашинах.',
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
      let answer = `На основе анализа отзывов и состава: продукт полностью безопасен и соответствует заявленным стандартам. Большинство покупателей считают его одной из лучших покупок в категории.`;
      if (q.toLowerCase().includes('хранить') || q.toLowerCase().includes('срок')) {
        answer = 'После вскрытия упаковки производитель рекомендует хранить продукт в холодильнике не более 3 суток при температуре от +2°C до +6°C.';
      } else if (q.toLowerCase().includes('блин') || q.toLowerCase().includes('тест')) {
        answer = 'Для блинного теста подходит превосходно — тесто получается эластичным, блины не рвутся и имеют приятный сливочно-золотистый цвет.';
      } else if (q.toLowerCase().includes('сахар') || q.toLowerCase().includes('состав')) {
        answer = 'В составе только нормализованное молоко высшего сорта. Добавленного сахара, растительных жиров и консервантов не обнаружено.';
      }

      setAiAnswers((prev) => [{ q, a: answer }, ...prev]);
      setIsAskingAi(false);
    }, 600);
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
    <div className="space-y-4 pb-32 animate-fade-in">
      {/* Top Floating App Bar (Glass) */}
      <div className="sticky top-0 z-30 flex items-center justify-between p-3 -mx-4 px-4 glass-dock border-b border-white/60 shadow-xs">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-[#1C381B] hover:bg-white transition-all shadow-xs"
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="text-center px-2 truncate max-w-[200px]">
          <span className="text-xs font-bold text-[#142C13] truncate block">
            {product.name}
          </span>
          <span className="text-[10px] text-[#698567]">
            {product.brand} · {product.volumeWeight}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-[#2A4C28] hover:bg-white transition-all shadow-xs"
            title="Поделиться"
          >
            <Share2 className="w-4 h-4 stroke-[2.2]" />
          </button>

          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs ${
              isFav
                ? 'bg-rose-500 text-white'
                : 'glass-pill text-[#2A4C28] hover:bg-white'
            }`}
            aria-label="В избранное"
          >
            <Heart className={`w-4 h-4 stroke-[2.2] ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {copiedShare && (
        <div className="p-2.5 rounded-2xl glass-card-dark text-[#D8FF4F] text-xs font-bold text-center border border-white/20">
          Ссылка скопирована в буфер обмена!
        </div>
      )}

      {/* Main Product Hero Card (Glassmorphic Surface matching Reference) */}
      <div className="glass-card rounded-[32px] p-5 shadow-md border border-white/80">
        {/* Large Product Photography */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white/50 mb-4 border border-white/80 shadow-xs flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Barcode badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-card-dark text-white text-[11px] font-mono flex items-center gap-1.5 border border-white/20">
            <span>Штрихкод: {product.barcode}</span>
          </div>

          {/* Savings Badge */}
          {product.priceDifferencePercent < 0 && (
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-linear-to-r from-[#173315] to-[#254A22] text-[#D8FF4F] text-xs font-black flex items-center gap-1.5 shadow-lg border border-white/20">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{product.priceDifferencePercent}% к средней цене</span>
            </div>
          )}
        </div>

        {/* Product Identity */}
        <div className="space-y-1 mb-3">
          <div className="text-[10px] font-bold text-[#648462] uppercase tracking-wider">
            {product.brand} · {product.category}
          </div>
          <h2 className="text-2xl font-black text-[#132A12] tracking-tight leading-snug">
            {product.name}
          </h2>
          <div className="text-xs text-[#547352]">
            {product.volumeWeight}
          </div>
        </div>

        {/* Rating Row (Glass Inset) */}
        <div className="flex items-center gap-3 py-2.5 px-3 rounded-2xl glass-pill mb-4">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-black text-[#162F14] tabular-nums">
              {product.rating}
            </span>
          </div>

          <span className="text-[#88A486]">·</span>

          <span className="text-xs font-bold text-[#4D6D4A]">
            {product.reviewCount} оценок покупателей
          </span>
        </div>

        {/* Current Store Anchor Banner (Deep Green Glass Card with Lime highlights) */}
        <div className="p-4 rounded-3xl glass-card-dark text-white flex items-center justify-between border border-white/20 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-200 font-bold">
                {product.currentStore.name}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-[#D8FF4F] text-[10px] font-black border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8FF4F] animate-pulse" />
                {product.currentStore.timestamp}
              </span>
            </div>

            <div className="text-3xl font-black text-[#D8FF4F] tracking-tight tabular-nums mt-0.5">
              {product.currentStore.price} ₽
            </div>

            <div className="text-[11px] text-emerald-100/70">
              Средняя цена: {product.averagePrice} ₽
            </div>
          </div>

          <button
            onClick={onOpenMap}
            className="h-11 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/20 backdrop-blur-md"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D8FF4F]" />
            <span>На карте</span>
          </button>
        </div>
      </div>

      {/* Decision Tip Banner (Frosted Glass with Green glow) */}
      <div className="p-3.5 rounded-3xl glass-card flex items-center gap-3 border border-white/80 shadow-xs">
        <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#4A7A45] to-[#2E522B] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#D8FF4F]" />
        </div>
        <div className="text-xs text-[#1F3D1D]">
          <strong className="block font-bold">Решение Scanly:</strong>
          {product.cheapestStore.name === product.currentStore.name
            ? `Вы в самом выгодном магазине! Здесь экономия ${product.cheapestStore.savings} ₽ по сравнению с другими сетями.`
            : `В магазине ${product.cheapestStore.name} можно купить дешевле на ${product.cheapestStore.savings} ₽.`}
        </div>
      </div>

      {/* Segmented Sub-tab Navigation (Glass Pills) */}
      <div className="p-1 rounded-2xl glass-card flex items-center gap-1 shadow-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-center ${
            activeTab === 'overview'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#4F6D4C] hover:text-[#183116]'
          }`}
        >
          Обзор & AI
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-center ${
            activeTab === 'prices'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#4F6D4C] hover:text-[#183116]'
          }`}
        >
          Цены ({product.storePrices.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-center ${
            activeTab === 'reviews'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#4F6D4C] hover:text-[#183116]'
          }`}
        >
          Отзывы ({localReviews.length})
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-center ${
            activeTab === 'nutrition'
              ? 'glass-pill-active shadow-sm'
              : 'text-[#4F6D4C] hover:text-[#183116]'
          }`}
        >
          БЖУ & Состав
        </button>
      </div>

      {/* Tab 1: Overview & AI Summary */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="glass-card rounded-[32px] p-5 border border-white/80 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#4A7A45] to-[#2E522B] text-[#D8FF4F] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#142B12]">
                    AI-сводка отзывов
                  </h3>
                  <div className="text-[10px] text-[#698867]">
                    Анализ {product.reviewCount} мнений покупателей
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#4A7A45] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                94% рекомендуют
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#183316] leading-relaxed font-medium glass-pill p-3.5 rounded-2xl">
              «{product.aiSummary.summary}»
            </p>

            {/* Pros and Cons Inset Glass Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-600/20 backdrop-blur-md space-y-2">
                <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Что хвалят покупатели:</span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-1.5">
                  {product.aiSummary.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-600/20 backdrop-blur-md space-y-2">
                <div className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                  <span>На что жалуются:</span>
                </div>
                <ul className="text-xs text-rose-950 space-y-1.5">
                  {product.aiSummary.cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-rose-700 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Q&A Input */}
            <div className="pt-2 border-t border-white/60 space-y-2.5">
              <div className="text-xs font-bold text-[#142D13] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#4A7A45]" />
                <span>Спросить у AI о продукте:</span>
              </div>

              <form onSubmit={handleAskAi} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Например: Подойдет ли для капучино?"
                  className="flex-1 h-10 px-3.5 rounded-full glass-input text-xs font-medium text-[#162E15] focus:outline-none focus:border-[#4A7A45]"
                />
                <button
                  type="submit"
                  disabled={isAskingAi || !customQuestion.trim()}
                  className="h-10 px-4 rounded-full bg-[#4A7A45] hover:bg-[#3B6636] text-white font-bold text-xs flex items-center gap-1 disabled:opacity-50 transition-all shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Спросить</span>
                </button>
              </form>

              {/* Answers feed */}
              <div className="space-y-2">
                {aiAnswers.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl glass-pill text-xs space-y-1 shadow-xs">
                    <div className="font-bold text-[#142D13]">❓ {item.q}</div>
                    <div className="text-[#395637] leading-relaxed">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prices in Offline Grocery Chains */}
      {activeTab === 'prices' && (
        <div className="space-y-3">
          <div className="glass-card rounded-[32px] p-5 border border-white/80 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#142E13]">
                Где купить дешевле
              </h3>
              <button
                onClick={onOpenMap}
                className="text-xs font-bold text-[#3E6C38] hover:text-[#183116] flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>На карте</span>
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {product.storePrices.map((sp) => {
                const isCurrent = sp.isCurrent;
                const isCheapest = sp.isCheapest;

                return (
                  <div
                    key={sp.store}
                    className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                      isCheapest
                        ? 'bg-emerald-500/15 border border-emerald-600/30'
                        : isCurrent
                        ? 'glass-card border border-white/90 shadow-xs'
                        : 'glass-pill'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#4A7A45] to-[#2E522B] text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {sp.store[0]}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[#142E13]">
                            {sp.store}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#183316] text-white text-[9px] font-bold">
                              Сейчас здесь
                            </span>
                          )}
                          {isCheapest && (
                            <span className="px-2 py-0.5 rounded-full bg-[#D8FF4F] text-[#071304] text-[9px] font-extrabold shadow-xs">
                              Выгодно
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-[#5A7758] flex items-center gap-2 mt-0.5 font-medium">
                          <span>{sp.distance}</span>
                          <span>·</span>
                          <span className="text-[#356130] font-bold">В наличии</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-[#142E13] tabular-nums">
                        {sp.price} ₽
                      </div>
                      {sp.oldPrice && (
                        <div className="line-through text-[11px] text-[#849F82] tabular-nums">
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
        <div className="space-y-3">
          <div className="glass-card rounded-[32px] p-5 border border-white/80 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#142E13]">
                  Отзывы покупателей
                </h3>
                <div className="text-xs text-[#5D7B5B]">
                  {product.reviewCount} отзывов с подтвержденной покупкой
                </div>
              </div>

              <button
                onClick={onOpenWriteReview}
                className="px-4 py-2 rounded-full bg-[#4A7A45] hover:bg-[#3A6435] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>+ Написать</span>
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setReviewsFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  reviewsFilter === 'all'
                    ? 'glass-pill-active shadow-sm'
                    : 'glass-pill text-[#4E6C4B]'
                }`}
              >
                Все
              </button>

              <button
                onClick={() => setReviewsFilter('photo')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  reviewsFilter === 'photo'
                    ? 'glass-pill-active shadow-sm'
                    : 'glass-pill text-[#4E6C4B]'
                }`}
              >
                <Camera className="w-3 h-3" />
                С фото
              </button>

              <button
                onClick={() => setReviewsFilter('verified')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  reviewsFilter === 'verified'
                    ? 'glass-pill-active shadow-sm'
                    : 'glass-pill text-[#4E6C4B]'
                }`}
              >
                Покупатели
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-3 pt-1">
              {filteredReviews.map((rev) => {
                const hasLiked = userLikedReviews[rev.id];

                return (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl glass-card border border-white/80 space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#4A7A45] to-[#31562D] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {rev.userName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#142E13]">
                              {rev.userName}
                            </span>
                            {rev.userBadge && (
                              <span className="px-1.5 py-0.5 rounded-md bg-[#D8FF4F] text-[#071304] text-[9px] font-black">
                                {rev.userBadge}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#71906F]">
                            {rev.date}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-[#142E13] tabular-nums">
                          Куплено за {rev.pricePaid} ₽
                        </div>
                        <div className="text-[10px] text-[#547352]">
                          в {rev.store}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-[#244322] leading-relaxed font-normal">
                      {rev.text}
                    </p>

                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        {rev.photos.map((p, idx) => (
                          <div
                            key={idx}
                            className="w-16 h-16 rounded-xl overflow-hidden bg-white/40 border border-white/70 shadow-xs"
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

                    <div className="flex items-center justify-between pt-2 border-t border-white/60 text-xs text-[#577555]">
                      <button
                        onClick={() => handleToggleLikeReview(rev.id)}
                        className={`flex items-center gap-1.5 font-bold transition-all ${
                          hasLiked ? 'text-[#3E6C38]' : 'hover:text-[#142E13]'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                        <span>Полезно ({rev.likes})</span>
                      </button>

                      <div className="flex items-center gap-1 text-[#71906F]">
                        <MessageCircle className="w-3.5 h-3.5" />
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

      {/* Tab 4: Nutrition & KBJU Grid (Matching Care Overview 4-tile grid in Reference Screen 2) */}
      {activeTab === 'nutrition' && (
        <div className="space-y-3">
          <div className="glass-card rounded-[32px] p-5 border border-white/80 shadow-md space-y-4">
            <h3 className="text-base font-black text-[#142E13]">
              Пищевая ценность и состав
            </h3>

            <div className="text-xs font-bold text-[#567554]">
              Показатели {product.nutrition.serving.toLowerCase()}:
            </div>

            {/* 4 Frosted Glass Stat Tiles (Exact style of Water, Light, Temp, Humidity from Reference) */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-2xl glass-pill shadow-xs">
                <div className="text-[10px] text-[#678865] font-semibold">Калории</div>
                <div className="text-base font-black text-[#142E13] tabular-nums mt-0.5">
                  {product.nutrition.calories}
                </div>
                <div className="text-[9px] text-[#7A9978]">ккал</div>
              </div>

              <div className="p-3 rounded-2xl glass-pill shadow-xs">
                <div className="text-[10px] text-[#678865] font-semibold">Белки</div>
                <div className="text-base font-black text-[#142E13] tabular-nums mt-0.5">
                  {product.nutrition.proteins}
                </div>
                <div className="text-[9px] text-[#7A9978]">г</div>
              </div>

              <div className="p-3 rounded-2xl glass-pill shadow-xs">
                <div className="text-[10px] text-[#678865] font-semibold">Жиры</div>
                <div className="text-base font-black text-[#142E13] tabular-nums mt-0.5">
                  {product.nutrition.fats}
                </div>
                <div className="text-[9px] text-[#7A9978]">г</div>
              </div>

              <div className="p-3 rounded-2xl glass-pill shadow-xs">
                <div className="text-[10px] text-[#678865] font-semibold">Углеводы</div>
                <div className="text-base font-black text-[#142E13] tabular-nums mt-0.5">
                  {product.nutrition.carbs}
                </div>
                <div className="text-[9px] text-[#7A9978]">г</div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-bold text-[#142E13]">
                Состав продукта:
              </div>
              <p className="text-xs sm:text-sm text-[#274725] leading-relaxed glass-pill p-3.5 rounded-2xl font-medium shadow-xs">
                {product.ingredients}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.badges.map((b) => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-full glass-pill text-[#1E3B1C] text-xs font-bold shadow-xs border border-white/80"
                >
                  ✓ {b}
                </span>
              ))}
            </div>

            <div className="p-3 rounded-2xl glass-pill flex items-start gap-2.5 text-[11px] text-[#5A7758] shadow-xs">
              <Info className="w-4 h-4 text-[#4A7A45] shrink-0 mt-0.5" />
              <span>
                Информация собрана из открытых источников и базы производителей. Перед употреблением сверяйте фактический состав на упаковке в магазине.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
