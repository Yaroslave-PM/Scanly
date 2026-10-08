import React, { useState } from 'react';
import {
  Star,
  Camera,
  X,
  Upload,
} from 'lucide-react';
import { Product, Review } from '../data/products';

interface WriteReviewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [text, setText] = useState('');
  const [pricePaid, setPricePaid] = useState<number>(product.currentStore.price);
  const [store, setStore] = useState<string>(product.currentStore.name);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const storesList = ['Пятёрочка', 'Магнит', 'Лента', 'Перекрёсток', 'ВкусВилл'];

  const handleAddSamplePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=400&q=80',
    ];
    const nextPhoto = samplePhotos[photos.length % samplePhotos.length];
    setPhotos([...photos, nextPhoto]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        userName: 'Ярослав',
        userBadge: 'Проверенный покупатель',
        userReputation: 4.8,
        isVerifiedBuyer: true,
        date: 'Только что',
        rating,
        pricePaid: Number(pricePaid) || product.currentStore.price,
        store,
        text: text.trim(),
        photos: photos.length > 0 ? photos : undefined,
        likes: 1,
        hasLiked: true,
        commentsCount: 0,
      };

      onSubmitReview(newReview);
      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg glass-card rounded-t-[36px] sm:rounded-[36px] p-6 sm:p-7 shadow-2xl border border-white/90 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/70 mb-4.5">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#355733] uppercase tracking-wider">
              Новый отзыв
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#071707] truncate max-w-[280px]">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#071707] hover:bg-white active:scale-95 transition-all"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars Card */}
          <div className="glass-card p-5 rounded-2xl border border-white/90 text-center shadow-xs">
            <label className="block text-xs font-extrabold text-[#071707] mb-2.5 uppercase tracking-wider">
              Ваша оценка товару
            </label>
            <div className="flex items-center justify-center gap-2.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        active
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#204E1E] mt-2.5">
              {rating === 5 && '🔥 Отличный товар, рекомендую!'}
              {rating === 4 && '👍 Хорошо, но есть мелкие замечания'}
              {rating === 3 && '😐 Нормально, на любителя'}
              {rating === 2 && '👎 Скорее не советую'}
              {rating === 1 && '❌ Ужасно, не берите'}
            </div>
          </div>

          {/* Review Text */}
          <div className="glass-card p-4.5 rounded-2xl border border-white/90 space-y-2 shadow-xs">
            <label className="block text-xs font-extrabold text-[#071707] uppercase tracking-wider">
              Текст отзыва
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Опишите вкус, свежесть, консистенцию и реальные впечатления..."
              required
              className="w-full p-3 rounded-xl glass-input text-xs sm:text-sm text-[#071707] placeholder:text-[#4A6E48] font-medium outline-none focus:border-[#254F22] resize-none"
            />
          </div>

          {/* Price Paid and Store Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 rounded-2xl border border-white/90 space-y-1.5 shadow-xs">
              <label className="block text-xs font-bold text-[#355733]">
                Цена покупки, ₽
              </label>
              <input
                type="number"
                value={pricePaid}
                onChange={(e) => setPricePaid(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl glass-input text-base font-black text-[#071707] outline-none"
              />
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/90 space-y-1.5 shadow-xs">
              <label className="block text-xs font-bold text-[#355733]">
                Где покупали
              </label>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className="w-full h-11 px-3 rounded-xl glass-input text-xs sm:text-sm font-bold text-[#071707] outline-none cursor-pointer"
              >
                {storesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo Attachments */}
          <div className="glass-card p-4 rounded-2xl border border-white/90 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#071707] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#254F22]" />
                <span>Фото товара или чека:</span>
              </span>
              <span className="text-[#355733] text-[11px] font-semibold">
                Повышает доверие к отзыву
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-[#254F22]/40 glass-pill hover:bg-white/80 flex flex-col items-center justify-center text-[#254F22] text-[10px] font-bold gap-1 shrink-0 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Добавить</span>
              </button>

              {photos.map((p, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/50 border border-white/90 shrink-0"
                >
                  <img src={p} alt="Фото к отзыву" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="w-full h-13 rounded-2xl bg-linear-to-r from-[#254F22] to-[#142D12] text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:shadow-[0_8px_24px_rgba(25,58,23,0.35)] active:scale-[0.98] disabled:opacity-50 transition-all shadow-md"
          >
            <span>{isSubmitting ? 'Публикация...' : 'Опубликовать отзыв'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
