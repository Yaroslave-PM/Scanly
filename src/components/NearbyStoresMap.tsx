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
    <div className="space-y-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#527150] font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#3A6435]" />
            <span>{selectedCity} · Радиус 2 км</span>
          </div>
          <h2 className="text-xl font-black text-[#142C12] tracking-tight">
            Магазины рядом с ценами
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#234421] hover:bg-white shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Interactive Vector Map Container in Frosted Frame */}
      <div className="relative w-full h-80 sm:h-96 rounded-[32px] overflow-hidden border border-white/80 shadow-md bg-[#e2ebe0]">
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
          <text x="310" y="285" fill="#749eb2" fontSize="9" fontWeight="bold">
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
          <text x="110" y="125" fill="#889e85" fontSize="8" fontWeight="600">
            ул. Большая Садовая
          </text>
          <text x="110" y="65" fill="#889e85" fontSize="7" fontWeight="600">
            ул. Пушкинская
          </text>
          <text x="228" y="40" fill="#889e85" fontSize="7" fontWeight="600" transform="rotate(90 228 40)">
            пр. Ворошиловский
          </text>

          {/* Route line if built */}
          {routeBuilt && (
            <path
              d={`M 152 144 Q 180 144 ${selectedStore.mapCoords.x * 4} ${selectedStore.mapCoords.y * 3}`}
              stroke="#2E542A"
              strokeWidth="4"
              strokeDasharray="6 4"
              fill="none"
              className="animate-pulse"
            />
          )}

          {/* User Location Pulse */}
          <g transform="translate(152, 144)">
            <circle r="16" fill="#3B6636" opacity="0.25" className="animate-ping" />
            <circle r="8" fill="#2E542A" />
            <circle r="3" fill="#D8FF4F" />
          </g>
        </svg>

        {/* User label */}
        <div className="absolute top-[44%] left-[32%] -translate-x-1/2 -translate-y-8 glass-card-dark text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md pointer-events-none border border-white/20">
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
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-lg transition-transform ${
                  isSelected
                    ? 'scale-115 ring-3 ring-white ' +
                      (isCheapest ? 'bg-[#D8FF4F] text-[#071304]' : 'bg-[#183416] text-[#D8FF4F]')
                    : isCheapest
                    ? 'bg-[#D8FF4F] text-[#071304] hover:scale-105'
                    : 'glass-card text-[#152E14] hover:scale-105 border border-white/90'
                }`}
              >
                <span>{sp.price} ₽</span>
                {isCheapest && <span className="text-[10px]">🔥</span>}
              </div>

              <div
                className={`w-2 h-2 mx-auto rotate-45 -mt-1 shadow-xs ${
                  isSelected
                    ? isCheapest
                      ? 'bg-[#D8FF4F]'
                      : 'bg-[#183416]'
                    : isCheapest
                    ? 'bg-[#D8FF4F]'
                    : 'bg-white'
                }`}
              />
            </div>
          );
        })}

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 glass-card p-2.5 rounded-2xl border border-white/80 text-[10px] text-[#476545] space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#142C12]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D8FF4F] border border-black/40" />
            <span>Лучшая цена в районе</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E542A]" />
            <span>Ваша локация</span>
          </div>
        </div>
      </div>

      {/* Selected Store Detail Card in Frosted Glass */}
      <div className="glass-card rounded-[32px] p-5 border border-white/80 shadow-md space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#142C12]">
                {selectedStore.store}
              </h3>
              {selectedStore.isCurrent && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-[#244A21] border border-emerald-600/20 text-[10px] font-black">
                  Вы в этом магазине
                </span>
              )}
              {selectedStore.isCheapest && (
                <span className="px-2 py-0.5 rounded-full bg-[#D8FF4F] text-[#071304] text-[10px] font-black shadow-xs">
                  Выгоднее всех
                </span>
              )}
            </div>

            <div className="text-xs text-[#567554] mt-0.5 font-medium">
              {selectedStore.address}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-[#142C12] tabular-nums">
              {selectedStore.price} ₽
            </div>
            <div className="text-[11px] text-[#71906F]">
              за {product.volumeWeight.split('·')[1]?.trim() || '1 шт'}
            </div>
          </div>
        </div>

        {/* 3 Frosted Stat Tiles */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2.5 rounded-2xl glass-pill shadow-xs">
            <div className="text-[10px] text-[#698867] font-semibold">Расстояние</div>
            <div className="text-xs font-black text-[#142C12]">{selectedStore.distance}</div>
          </div>

          <div className="p-2.5 rounded-2xl glass-pill shadow-xs">
            <div className="text-[10px] text-[#698867] font-semibold">Наличие</div>
            <div className="text-xs font-bold text-[#2A5227] flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#3B6636]" />
              <span>В наличии</span>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl glass-pill shadow-xs">
            <div className="text-[10px] text-[#698867] font-semibold">Режим работы</div>
            <div className="text-xs font-black text-[#142C12]">08:00 – 23:00</div>
          </div>
        </div>

        {/* Action Button: Маршрут (Lush Gradient Button) */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setRouteBuilt(!routeBuilt)}
            className={`flex-1 h-12 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              routeBuilt
                ? 'bg-[#294B26] text-white'
                : 'bg-linear-to-r from-[#4A7A45] to-[#2E522B] text-white hover:shadow-[0_8px_20px_rgba(45,85,41,0.25)]'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>{routeBuilt ? 'Маршрут построен (пешком 3 мин)' : 'Построить пеший маршрут'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
