import React from 'react';
import {
  Home,
  Search,
  ScanBarcode,
  Heart,
  User,
} from 'lucide-react';

export type TabType = 'home' | 'search' | 'scanner' | 'favorites' | 'profile';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  favoritesCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
}) => {
  return (
    <nav
      className="fixed bottom-4 left-0 right-0 z-40 px-4 max-w-md mx-auto pointer-events-none"
      aria-label="Основная навигация"
    >
      <div className="pointer-events-auto h-16 rounded-full glass-dock text-[#071707] px-3 shadow-[0_14px_40px_rgba(15,40,18,0.18)] flex items-center justify-between border border-white/95">
        {/* Главная */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex-1 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
            activeTab === 'home'
              ? 'text-[#071707] font-black'
              : 'text-[#355733] hover:text-[#071707]'
          }`}
          aria-label="Главная"
        >
          <div className={`p-1 rounded-full transition-colors ${activeTab === 'home' ? 'bg-[#254F22]/15' : ''}`}>
            <Home className="w-5 h-5 stroke-[2.4]" />
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">Главная</span>
        </button>

        {/* Поиск */}
        <button
          onClick={() => onSelectTab('search')}
          className={`flex-1 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
            activeTab === 'search'
              ? 'text-[#071707] font-black'
              : 'text-[#355733] hover:text-[#071707]'
          }`}
          aria-label="Поиск"
        >
          <div className={`p-1 rounded-full transition-colors ${activeTab === 'search' ? 'bg-[#254F22]/15' : ''}`}>
            <Search className="w-5 h-5 stroke-[2.4]" />
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">Поиск</span>
        </button>

        {/* Сканер (Prominent Center Glass Button) */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => onSelectTab('scanner')}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-[0_8px_24px_rgba(25,55,23,0.35)] ${
              activeTab === 'scanner'
                ? 'bg-linear-to-b from-[#D8FF4F] to-[#b3e620] text-[#071304] ring-4 ring-white scale-105'
                : 'bg-linear-to-b from-[#254F22] to-[#122A10] text-white hover:scale-105 ring-4 ring-white'
            }`}
            aria-label="Сканировать"
          >
            <ScanBarcode className="w-7 h-7 stroke-[2.4]" />
          </button>
        </div>

        {/* Избранное */}
        <button
          onClick={() => onSelectTab('favorites')}
          className={`relative flex-1 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
            activeTab === 'favorites'
              ? 'text-[#071707] font-black'
              : 'text-[#355733] hover:text-[#071707]'
          }`}
          aria-label="Избранное"
        >
          <div className={`relative p-1 rounded-full transition-colors ${activeTab === 'favorites' ? 'bg-[#254F22]/15' : ''}`}>
            <Heart className={`w-5 h-5 stroke-[2.4] ${activeTab === 'favorites' ? 'fill-[#254F22]' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-1.5 px-1 min-w-[14px] h-3.5 rounded-full bg-[#254F22] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">Избранное</span>
        </button>

        {/* Профиль */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex-1 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
            activeTab === 'profile'
              ? 'text-[#071707] font-black'
              : 'text-[#355733] hover:text-[#071707]'
          }`}
          aria-label="Профиль"
        >
          <div className={`p-1 rounded-full transition-colors ${activeTab === 'profile' ? 'bg-[#254F22]/15' : ''}`}>
            <User className="w-5 h-5 stroke-[2.4]" />
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">Профиль</span>
        </button>
      </div>
    </nav>
  );
};
