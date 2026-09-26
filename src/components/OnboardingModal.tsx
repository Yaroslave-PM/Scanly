import React from 'react';
import { ScanBarcode, Sparkles, Store, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartScan: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartScan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md glass-card rounded-[36px] p-6 sm:p-7 shadow-2xl border border-white/90 overflow-hidden">
        {/* Soft decorative bokeh */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#7CA875]/25 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full glass-pill hover:bg-white active:scale-95 flex items-center justify-center text-[#071707] transition-all shadow-xs"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Brand Kicker */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#254F22] ring-2 ring-white" />
          <span className="text-xs font-bold tracking-wider text-[#355733] uppercase">
            Добро пожаловать в Scanly
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#071707] tracking-tight mb-2.5 leading-tight">
          Наведи камеру и сразу пойми: брать или нет
        </h2>

        <p className="text-sm text-[#274426] mb-6 leading-relaxed font-normal">
          Персональный ассистент покупателя прямо у магазинной полки. Никаких лишних действий — только 1 мгновенный скан.
        </p>

        {/* 4 Superpowers in Frosted Glass Rows */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl glass-pill shadow-xs border border-white/90">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#254F22] to-[#122A10] text-[#D8FF4F] flex items-center justify-center shrink-0 shadow-xs">
              <ScanBarcode className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-extrabold text-[#071707]">1. Сканируй штрихкод</div>
              <div className="text-xs text-[#355733] font-medium leading-normal">
                Распознаем продукт за полсекунды по камере смартфона
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl glass-pill shadow-xs border border-white/90">
            <div className="w-10 h-10 rounded-xl bg-[#D8FF4F] text-[#071304] flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-extrabold text-[#071707]">2. Читай AI-сводку отзывов</div>
              <div className="text-xs text-[#355733] font-medium leading-normal">
                Искусственный интеллект выделит главное из сотен мнений
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl glass-pill shadow-xs border border-white/90">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#254F22] to-[#122A10] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-extrabold text-[#071707]">3. Сравни цены офлайн-сетей</div>
              <div className="text-xs text-[#355733] font-medium leading-normal">
                Пятёрочка, Магнит, Лента, Перекрёсток, ВкусВилл на карте
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl glass-pill shadow-xs border border-white/90">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#254F22] to-[#122A10] text-[#D8FF4F] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-extrabold text-[#071707]">4. Решай уверенно</div>
              <div className="text-xs text-[#355733] font-medium leading-normal">
                Знаешь реальный состав, скрытые минусы и точную выгоду
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onStartScan();
            }}
            className="w-full h-13.5 rounded-2xl bg-linear-to-r from-[#254F22] to-[#122A10] text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:shadow-[0_8px_24px_rgba(25,58,23,0.35)] active:scale-[0.98] transition-all shadow-md"
          >
            <span>Начать сканирование</span>
            <ArrowRight className="w-4 h-4 text-[#D8FF4F]" />
          </button>

          <button
            onClick={onClose}
            className="w-full h-11 text-xs font-bold text-[#355733] hover:text-[#071707] transition-colors"
          >
            Перейти к каталогу
          </button>
        </div>
      </div>
    </div>
  );
};
