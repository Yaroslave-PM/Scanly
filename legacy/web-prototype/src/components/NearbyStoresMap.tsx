import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Product, StorePrice } from '../data/products';

interface NearbyStoresMapProps {
  product: Product;
  selectedCity: string;
  onClose?: () => void;
}

export const NearbyStoresMap: React.FC<NearbyStoresMapProps> = ({
  product,
  selectedCity,
  onClose,
}) => {
  const [selectedStore, setSelectedStore] = useState<StorePrice>(
    product.storePrices.find((s) => s.isCurrent) || product.storePrices[0]
  );
  const [routeBuilt, setRouteBuilt] = useState(false);

  return (
    <div className="space-y-4.5 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#355733] font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#254F22]" />
            <span>{selectedCity} · Радиус 2 км</span>
          </div>
          <h2 className="text-2xl font-black text-[#071707] tracking-tight">
            Магазины рядом с ценами
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-[#071707] hover:bg-white active:scale-95 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Interactive Vector Map Container in Frosted Frame */}
      <div className="relative w-full h-80 sm:h-96 rounded-[32px] overflow-hidden border border-white/90 shadow-md bg-[#e2ebe0]">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full object-cover select-none"
        >
          <rect width="400" height="300" fill="#e4ede2" />

          {/* Park zones */}
          <path
            d="M 280 20 Q 320 40 370 20 L 390 90 Q 340 100 290 80 Z"
            fill="#cee0c9"
          />
          <path
            d="M 20 180 Q 70 190 80 260 L 10 280 Z"
            fill="#cee0c9"
          />

          {/* Don River */}
          <path
            d="M 0 265 Q 120 250 220 270 T 400 260 L 400 300 L 0 300 Z"
            fill="#b0cfdf"
          />
          <text x="310" y="285" fill="#588da5" fontSize="10" fontWeight="bold">
            р. Дон
          </text>

          {/* Roads */}
          <line x1="0" y1="70" x2="400" y2="70" stroke="#ffffff" strokeWidth="12" />
          <line x1="0" y1="130" x2="400" y2="130" stroke="#ffffff" strokeWidth="14" />
          <line x1="0" y1="195" x2="400" y2="195" stroke="#ffffff" strokeWidth="10" />

          <line x1="100" y1="0" x2="100" y2="270" stroke="#ffffff" strokeWidth="14" />
          <line x1="220" y1="0" x2="220" y2="270" stroke="#ffffff" strokeWidth="16" />
          <line x1="320" y1="0" x2="320" y2="270" stroke="#ffffff" strokeWidth="10" />

          {/* Street Labels */}
          <text x="110" y="125" fill="#537250" fontSize="9" fontWeight="bold">
            ул. Большая Садовая
          </text>
          <text x="110" y="65" fill="#537250" fontSize="8" fontWeight="bold">
            ул. Пушкинская
          </text>
          <text x="228" y="40" fill="#537250" fontSize="8" fontWeight="bold" transform="rotate(90 228 40)">
            пр. Ворошиловский
          </text>

          {/* Route line if built */}
          {routeBuilt && (
            <path
              d={`M 152 144 Q 180 144 ${selectedStore.mapCoords.x * 4} ${selectedStore.mapCoords.y * 3}`}
              stroke="#1C3F1A"
              strokeWidth="4"
              strokeDasharray="6 4"
              fill="none"
              className="animate-pulse"
            />
          )}

          {/* User Location Pulse */}
          <g transform="translate(152, 144)">
            <circle r="16" fill="#254F22" opacity="0.3" className="animate-ping" />
            <circle r="9" fill="#1A3B18" />
            <circle r="3.5" fill="#D8FF4F" />
          </g>
        </svg>

        {/* User label */}
        <div className="absolute top-[44%] left-[32%] -translate-x-1/2 -translate-y-8 glass-card-dark text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md pointer-events-none border border-white/20">
          Вы здесь
        </div>

        {/* Floating Glass Price Pins */}
        {product.storePrices.map((sp) => {
          const isSelected = selectedStore.store === sp.store;
          const isCheapest = sp.isCheapest;

          return (
            <div
              key={sp.store}
              onClick={() => {
                setSelectedStore(sp);
                setRouteBuilt(false);
              }}
              style={{
                left: `${sp.mapCoords.x}%`,
                top: `${sp.mapCoords.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              <div
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-black shadow-lg transition-transform ${
                  isSelected
                    ? 'scale-115 ring-3 ring-white ' +
                      (isCheapest ? 'bg-[#D8FF4F] text-[#071304]' : 'bg-[#071707] text-[#D8FF4F]')
                    : isCheapest
                    ? 'bg-[#D8FF4F] text-[#071304] hover:scale-105'
                    : 'glass-card text-[#071707] hover:scale-105 border border-white/95'
                }`}
              >
                <span>{sp.price} ₽</span>
                {isCheapest && <span>🔥</span>}
              </div>

              <div
                className={`w-2.5 h-2.5 mx-auto rotate-45 -mt-1 shadow-xs ${
                  isSelected
                    ? isCheapest
                      ? 'bg-[#D8FF4F]'
                      : 'bg-[#071707]'
                    : isCheapest
                    ? 'bg-[#D8FF4F]'
                    : 'bg-white'
                }`}
              />
            </div>
          );
        })}

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 glass-card p-3 rounded-2xl border border-white/90 text-xs text-[#274426] space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-[#071707]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D8FF4F] ring-1 ring-black/40" />
            <span>Лучшая цена в районе</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1A3B18]" />
            <span>Ваша локация</span>
          </div>
        </div>
      </div>

      {/* Selected Store Detail Card in Frosted Glass */}
      <div className="glass-card rounded-[32px] p-5 sm:p-6 border border-white/90 shadow-md space-y-4.5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-[#071707]">
                {selectedStore.store}
              </h3>
              {selectedStore.isCurrent && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-[#1A3B18] border border-emerald-600/25 text-xs font-black">
                  Вы в этом магазине
                </span>
              )}
              {selectedStore.isCheapest && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#D8FF4F] text-[#071304] text-xs font-black shadow-xs">
                  Выгоднее всех
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm text-[#355733] font-medium">
              {selectedStore.address}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-[#071707] tabular-nums">
              {selectedStore.price} ₽
            </div>
            <div className="text-xs text-[#4F754A] font-semibold">
              за {product.volumeWeight.split('·')[1]?.trim() || '1 шт'}
            </div>
          </div>
        </div>

        {/* 3 Frosted Stat Tiles */}
        <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
          <div className="p-3 rounded-2xl glass-pill shadow-xs border border-white/90">
            <div className="text-xs text-[#355733] font-bold uppercase tracking-wider">Расстояние</div>
            <div className="text-sm sm:text-base font-black text-[#071707] mt-0.5">{selectedStore.distance}</div>
          </div>

          <div className="p-3 rounded-2xl glass-pill shadow-xs border border-white/90">
            <div className="text-xs text-[#355733] font-bold uppercase tracking-wider">Наличие</div>
            <div className="text-xs sm:text-sm font-bold text-[#1A3B18] flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#254F22]" />
              <span>В наличии</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl glass-pill shadow-xs border border-white/90">
            <div className="text-xs text-[#355733] font-bold uppercase tracking-wider">Режим</div>
            <div className="text-xs sm:text-sm font-black text-[#071707] mt-0.5">08:00 – 23:00</div>
          </div>
        </div>

        {/* Action Button: Маршрут */}
        <div className="pt-1">
          <button
            onClick={() => setRouteBuilt(!routeBuilt)}
            className={`w-full h-13 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98] ${
              routeBuilt
                ? 'bg-[#183616] text-[#D8FF4F]'
                : 'bg-linear-to-r from-[#254F22] to-[#142D12] text-white hover:shadow-[0_8px_24px_rgba(25,58,23,0.35)]'
            }`}
          >
            <Navigation className="w-4.5 h-4.5" />
            <span>{routeBuilt ? 'Маршрут построен (пешком 3 мин)' : 'Построить пеший маршрут'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
