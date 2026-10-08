import React, { useState } from 'react';
import {
  Award,
  Star,
  Store,
  Bell,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { Product } from '../data/products';

interface ProfileViewProps {
  products: Product[];
  selectedCity: string;
  onOpenCityModal: () => void;
  onOpenFavorites: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  products,
  selectedCity,
  onOpenCityModal,
  onOpenFavorites,
  onSelectProduct,
}) => {
  const [favoriteStores, setFavoriteStores] = useState<string[]>([
    'Пятёрочка',
    'Магнит',
    'Лента',
  ]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showReputationInfo, setShowReputationInfo] = useState(false);

  const allStores = ['Пятёрочка', 'Магнит', 'Лента', 'Перекрёсток', 'ВкусВилл'];

  const toggleStore = (storeName: string) => {
    if (favoriteStores.includes(storeName)) {
      if (favoriteStores.length > 1) {
        setFavoriteStores(favoriteStores.filter((s) => s !== storeName));
      }
    } else {
      setFavoriteStores([...favoriteStores, storeName]);
    }
  };

  return (
    <div className="space-y-4.5 pb-28">
      {/* Profile Header Glass Card */}
      <div className="glass-card rounded-[32px] p-6 border border-white/90 shadow-md">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-18 h-18 rounded-3xl bg-linear-to-tr from-[#254F22] to-[#3C6E38] text-white flex items-center justify-center font-black text-2xl shadow-md border border-white/60">
            Я
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D8FF4F] ring-2 ring-white flex items-center justify-center text-[#071304] shadow-xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#071707]">
                Ярослав
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#254F22] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                PRO
              </span>
            </div>
            <div className="text-xs text-[#355733] font-semibold">@yarke</div>
            <div className="flex items-center gap-1.5 text-xs text-[#204E1E] font-bold pt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#254F22]" />
              <span>Проверенный покупатель</span>
            </div>
          </div>
        </div>

        {/* Reputation & Engagement Stats (3 Inset Frosted Tiles) */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl glass-pill shadow-xs text-center border border-white/90">
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#071707] tabular-nums">47</div>
            <div className="text-xs text-[#355733] font-bold">отзывов</div>
          </div>

          <div className="border-x border-white/80">
            <div className="text-xl sm:text-2xl font-black text-[#071707] tabular-nums">1.2k</div>
            <div className="text-xs text-[#355733] font-bold">полезных</div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-black text-[#071707] tabular-nums flex items-center justify-center gap-1">
              <span>4.8</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="text-xs text-[#355733] font-bold">рейтинг</div>
          </div>
        </div>
      </div>

      {/* Trust & Reputation Card (Frosted Emerald Glass) */}
      <div className="p-5 rounded-3xl glass-card-dark text-white shadow-md border border-white/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D8FF4F] text-[#071304] flex items-center justify-center font-bold shadow-xs">
              <Award className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">Репутация покупателя</div>
              <div className="text-xs text-emerald-200 font-medium">Уровень доверия: Высокий (4.8 / 5.0)</div>
            </div>
          </div>

          <button
            onClick={() => setShowReputationInfo(!showReputationInfo)}
            className="text-xs font-bold text-[#D8FF4F] underline hover:text-white px-2 py-1"
          >
            {showReputationInfo ? 'Скрыть' : 'Инфо'}
          </button>
        </div>

        {showReputationInfo && (
          <p className="text-xs sm:text-sm text-emerald-100 mt-3 pt-3 border-t border-white/15 leading-relaxed font-normal">
            В Scanly оценки покупателей ранжируются по полезности. Отзывы пользователей с подтвержденными ценами и чеками получают приоритет в AI-сводках и защищают от накруток.
          </p>
        )}
      </div>

      {/* Preferences & Settings Section in Frosted Glass */}
      <div className="glass-card rounded-[32px] p-5 sm:p-6 border border-white/90 shadow-md space-y-4.5">
        <h3 className="text-xs font-black text-[#071707] uppercase tracking-wider">
          Персонализация покупок
        </h3>

        {/* Favorite Stores Toggles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[#071707] flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#254F22]" />
              <span>Любимые магазины:</span>
            </span>
            <span className="text-[#355733] text-xs font-semibold">
              Приоритет сравнения
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {allStores.map((st) => {
              const active = favoriteStores.includes(st);
              return (
                <button
                  key={st}
                  onClick={() => toggleStore(st)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shadow-xs ${
                    active
                      ? 'glass-pill-active'
                      : 'glass-pill text-[#244522] hover:bg-white'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* City Selector Row */}
        <div
          onClick={onOpenCityModal}
          className="flex items-center justify-between p-3.5 rounded-2xl glass-pill cursor-pointer hover:bg-white/90 active:scale-[0.99] transition-all shadow-xs border border-white/90"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4.5 h-4.5 text-[#254F22]" />
            <div>
              <div className="text-xs font-extrabold text-[#071707]">Ваш город</div>
              <div className="text-xs text-[#355733] font-semibold">{selectedCity}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#254F22]" />
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl glass-pill shadow-xs border border-white/90">
          <div className="flex items-center gap-3">
            <Bell className="w-4.5 h-4.5 text-[#254F22]" />
            <div>
              <div className="text-xs font-extrabold text-[#071707]">
                Уведомления о снижении цен
              </div>
              <div className="text-xs text-[#355733] font-medium">
                Сообщать, когда избранный товар подешевеет
              </div>
            </div>
          </div>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
              notificationsEnabled ? 'bg-[#254F22]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="glass-card rounded-[32px] p-2 sm:p-2.5 border border-white/90 shadow-md">
        <button
          onClick={onOpenFavorites}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/60 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-xs sm:text-sm font-bold text-[#071707]">Избранные товары</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#254F22]" />
        </button>

        <button
          onClick={() => onSelectProduct(products[0])}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/60 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-[#254F22]" />
            <span className="text-xs sm:text-sm font-bold text-[#071707]">Мои отзывы (1 опубликован)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#254F22]" />
        </button>
      </div>
    </div>
  );
};
