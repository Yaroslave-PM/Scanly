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
      <div className="pointer-events-auto h-16 rounded-full glass-dock text-[#2D452B] px-3 shadow-[0_12px_36px_rgba(20,50,22,0.14)] flex items-center justify-between">
        {/* Главная */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex-1 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
            activeTab === 'home'
              ? 'text-[#244722] font-black'
              : 'text-[#688266] hover:text-[#244722]'
          }`}
          aria-label="Главная"
        >
          <div className={`p-1 rounded-full transition-colors ${activeTab === 'home' ? 'bg-[#4A7A45]/15' : ''}`}>
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Главная</span>
        </button>

        {/* Поиск */}
        <button
          onClick={() => onSelectTab('search')}
          className={`flex-1 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
            activeTab === 'search'
              ? 'text-[#244722] font-black'
              : 'text-[#688266] hover:text-[#244722]'
          }`}
          aria-label="Поиск"
        >
          <div className={`p-1 rounded-full transition-colors ${activeTab === 'search' ? 'bg-[#4A7A45]/15' : ''}`}>
            <Search className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Поиск</span>
        </button>

        {/* Сканер (Prominent Center Glass Button) */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => onSelectTab('scanner')}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-[0_8px_24px_rgba(42,77,38,0.3)] ${
              activeTab === 'scanner'
                ? 'bg-linear-to-b from-[#D8FF4F] to-[#b3e620] text-[#071304] ring-4 ring-white/80 scale-105'
                : 'bg-linear-to-b from-[#4A7A45] to-[#2E522B] text-white hover:scale-105 ring-4 ring-white/80'
            }`}
            aria-label="Сканировать"
          >
            <ScanBarcode className="w-7 h-7 stroke-[2.3]" />
          </button>
        </div>

        {/* Избранное */}
        <button
          onClick={() => onSelectTab('favorites')}
          className={`relative flex-1 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
            activeTab === 'favorites'
              ? 'text-[#244722] font-black'
              : 'text-[#688266] hover:text-[#244722]'
          }`}
          aria-label="Избранное"
        >
          <div className={`relative p-1 rounded-full transition-colors ${activeTab === 'favorites' ? 'bg-[#4A7A45]/15' : ''}`}>
            <Heart className={`w-5 h-5 stroke-[2.2] ${activeTab === 'favorites' ? 'fill-[#4A7A45]' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-1 px-1 min-w-[14px] h-3.5 rounded-full bg-[#4A7A45] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Избранное</span>
        </button>

        {/* Профиль */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex-1 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
            activeTab === 'profile'
              ? 'text-[#244722] font-black'
              : 'text-[#688266] hover:text-[#244722]'
          }`}
          aria-label="Профиль"
        >
          <div className={`p-1 rounded-full transition-colors ${activeTab === 'profile' ? 'bg-[#4A7A45]/15' : ''}`}>
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Профиль</span>
        </button>
      </div>
    </nav>
  );
};

