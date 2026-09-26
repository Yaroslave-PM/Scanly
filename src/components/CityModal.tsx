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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl border border-white/80 max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4A7A45]/15 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#355F31]" />
            </div>
            <h3 className="text-lg font-black text-[#142C12]">Выберите город</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#2A4B27] hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#527150] mb-4 font-medium">
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
                    ? 'glass-pill-active font-black shadow-md'
                    : 'glass-pill hover:bg-white text-[#142C12] font-semibold'
                }`}
              >
                <span className="text-xs sm:text-sm">{city}</span>
                {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
