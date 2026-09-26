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
    <div className="space-y-4 pb-28">
      {/* Profile Header Glass Card */}
      <div className="glass-card rounded-[32px] p-6 border border-white/80 shadow-md">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-18 h-18 rounded-3xl bg-linear-to-tr from-[#3A6435] to-[#4F8349] text-white flex items-center justify-center font-black text-2xl shadow-md border border-white/50">
            Я
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D8FF4F] ring-2 ring-white flex items-center justify-center text-[#071304] shadow-xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#142C12]">
                Ярослав
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#4A7A45] text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                PRO
              </span>
            </div>
            <div className="text-xs text-[#628160] font-medium">@yarke</div>
            <div className="flex items-center gap-1.5 text-xs text-[#284C25] font-bold mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4A7A45]" />
              <span>Проверенный покупатель</span>
            </div>
          </div>
        </div>

        {/* Reputation & Engagement Stats (3 Inset Frosted Tiles) */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl glass-pill shadow-xs text-center">
          <div>
            <div className="text-xl font-black text-[#142C12] tabular-nums">47</div>
            <div className="text-[10px] text-[#5D7A5C] font-semibold">отзывов</div>
          </div>

          <div className="border-x border-white/60">
            <div className="text-xl font-black text-[#142C12] tabular-nums">1.2k</div>
            <div className="text-[10px] text-[#5D7A5C] font-semibold">полезных</div>
          </div>

          <div>
            <div className="text-xl font-black text-[#142C12] tabular-nums flex items-center justify-center gap-0.5">
              <span>4.8</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="text-[10px] text-[#5D7A5C] font-semibold">рейтинг</div>
          </div>
        </div>
      </div>

      {/* Trust & Reputation Card (Frosted Emerald Glass) */}
      <div className="p-4 rounded-3xl glass-card-dark text-white shadow-md border border-white/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#D8FF4F] text-[#071304] flex items-center justify-center font-bold shadow-xs">
              <Award className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Репутация покупателя</div>
              <div className="text-xs text-emerald-200">Уровень доверия: Высокий (4.8 / 5.0)</div>
            </div>
          </div>

          <button
            onClick={() => setShowReputationInfo(!showReputationInfo)}
            className="text-xs font-bold text-[#D8FF4F] underline hover:text-white"
          >
            {showReputationInfo ? 'Скрыть' : 'Инфо'}
          </button>
        </div>

        {showReputationInfo && (
          <p className="text-xs text-emerald-100/90 mt-3 pt-3 border-t border-white/10 leading-relaxed font-normal">
            В Scanly оценки покупателей ранжируются по полезности. Отзывы пользователей с подтвержденными ценами и чеками получают приоритет в AI-сводках и защищают от накруток.
          </p>
        )}
      </div>

      {/* Preferences & Settings Section in Frosted Glass */}
      <div className="glass-card rounded-[32px] p-5 border border-white/80 shadow-md space-y-4">
        <h3 className="text-xs font-black text-[#142C12] uppercase tracking-wider">
          Персонализация покупок
        </h3>

        {/* Favorite Stores Toggles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#142C12] flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#4A7A45]" />
              <span>Любимые магазины:</span>
            </span>
            <span className="text-[#6C8A6A] text-[10px]">
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                    active
                      ? 'glass-pill-active'
                      : 'glass-pill text-[#547452] hover:bg-white'
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
          className="flex items-center justify-between p-3 rounded-2xl glass-pill cursor-pointer hover:bg-white/80 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#4A7A45]" />
            <div>
              <div className="text-xs font-bold text-[#142C12]">Ваш город</div>
              <div className="text-[11px] text-[#597857]">{selectedCity}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6A8868]" />
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl glass-pill shadow-xs">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-[#4A7A45]" />
            <div>
              <div className="text-xs font-bold text-[#142C12]">
                Уведомления о снижении цен
              </div>
              <div className="text-[11px] text-[#597857]">
                Сообщать, когда избранный товар подешевеет
              </div>
            </div>
          </div>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
              notificationsEnabled ? 'bg-[#365D32]' : 'bg-slate-300'
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
      <div className="glass-card rounded-[32px] p-2 border border-white/80 shadow-md">
        <button
          onClick={onOpenFavorites}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-[#142C12]">Избранные товары</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6C8A6A]" />
        </button>

        <button
          onClick={() => onSelectProduct(products[0])}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-[#4A7A45]" />
            <span className="text-xs font-bold text-[#142C12]">Мои отзывы (1 опубликован)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6C8A6A]" />
        </button>
      </div>
    </div>
  );
};
