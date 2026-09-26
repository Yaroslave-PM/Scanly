import React, { useState } from 'react';
import {
  Star,
  Camera,
  X,
  Upload,
  CheckCircle2,
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
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg glass-card rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl border border-white/80 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/60 mb-4">
          <div>
            <span className="text-[10px] font-bold text-[#6D8C6B] uppercase tracking-wider">
              Новый отзыв
            </span>
            <h3 className="text-base font-black text-[#142C12] truncate max-w-[280px]">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#234521] hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Rating Stars Card */}
          <div className="glass-card p-4 rounded-2xl border border-white/80 text-center shadow-xs">
            <label className="block text-xs font-bold text-[#142C12] mb-2">
              Ваша оценка товару
            </label>
            <div className="flex items-center justify-center gap-2">
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
            <div className="text-xs font-semibold text-[#547352] mt-2">
              {rating === 5 && '🔥 Отличный товар, рекомендую!'}
              {rating === 4 && '👍 Хорошо, но есть мелкие замечания'}
              {rating === 3 && '😐 Нормально, на любителя'}
              {rating === 2 && '👎 Скорее не советую'}
              {rating === 1 && '❌ Ужасно, не берите'}
            </div>
          </div>

          {/* Review Text */}
          <div className="glass-card p-4 rounded-2xl border border-white/80 space-y-2 shadow-xs">
            <label className="block text-xs font-bold text-[#142C12]">
              Текст отзыва
            </label>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Расскажите о вкусе, качестве, упаковке и стоит ли брать за эту цену..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl glass-input focus:bg-white/80 focus:outline-none placeholder:text-[#789676] text-[#142C12]"
            />
          </div>

          {/* Price & Store Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 rounded-2xl border border-white/80 space-y-1 shadow-xs">
              <label className="block text-[11px] font-bold text-[#142C12]">
                Цена покупки (₽)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={pricePaid}
                  onChange={(e) => setPricePaid(Number(e.target.value))}
                  className="w-full h-10 px-3 pr-7 rounded-xl glass-input text-sm font-black text-[#142C12] focus:outline-none"
                />
                <span className="absolute right-2.5 top-2.5 text-xs text-[#6F8E6D] font-bold">
                  ₽
                </span>
              </div>
            </div>

            <div className="glass-card p-3 rounded-2xl border border-white/80 space-y-1 shadow-xs">
              <label className="block text-[11px] font-bold text-[#142C12]">
                Где купили?
              </label>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className="w-full h-10 px-2 rounded-xl glass-input text-xs font-bold text-[#142C12] focus:outline-none cursor-pointer"
              >
                {storesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="glass-card p-3.5 rounded-2xl border border-white/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#142C12]">
                Фотографии товара ({photos.length}/3)
              </span>
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="text-[11px] font-bold text-[#355F32] hover:text-[#183416] flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Добавить фото</span>
              </button>
            </div>

            {photos.length === 0 ? (
              <div
                onClick={handleAddSamplePhoto}
                className="h-16 rounded-xl border border-dashed border-white/80 glass-pill flex items-center justify-center gap-2 text-xs text-[#5D7B5B] cursor-pointer hover:bg-white/80 transition-all"
              >
                <Upload className="w-4 h-4 text-[#5D7B5B]" />
                <span>Прикрепить фото упаковки или чека</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/40 border border-white/80 shadow-xs">
                    <img src={p} alt="Прикрепленное фото" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px]"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    className="w-14 h-14 rounded-xl border border-dashed border-white/80 glass-pill flex items-center justify-center text-[#597857] hover:bg-white text-xs"
                  >
                    +
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="w-full h-13 rounded-2xl bg-linear-to-r from-[#4A7A45] to-[#2E522B] text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(45,85,41,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Публикуем...' : 'Опубликовать отзыв'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
