import React from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { POPULAR_CITIES } from '../data/products';

interface CityModalProps {
  isOpen: boolean;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onClose: () => void;
}

export const CityModal: React.FC<CityModalProps> = ({
  isOpen,
  selectedCity,
  onSelectCity,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-t-[36px] sm:rounded-[36px] p-6 sm:p-7 shadow-2xl border border-white/90 max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#254F22] to-[#122A10] text-[#D8FF4F] flex items-center justify-center shadow-xs">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-lg font-black text-[#071707]">Выберите город</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#071707] hover:bg-white active:scale-95 transition-all shadow-xs"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <p className="text-xs text-[#355733] mb-4.5 font-medium leading-relaxed">
          Scanly покажет актуальные цены и наличие в ближайших супермаркетах вашего района.
        </p>

        <div className="space-y-2">
          {POPULAR_CITIES.map((city) => {
            const isSelected = city === selectedCity;
            return (
              <button
                key={city}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all ${
                  isSelected
                    ? 'glass-pill-active shadow-sm font-extrabold'
                    : 'glass-pill hover:bg-white/80 text-[#071707] font-semibold'
                }`}
              >
                <span className="text-sm">{city}</span>
                {isSelected && <Check className="w-4.5 h-4.5 text-[#D8FF4F] stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
