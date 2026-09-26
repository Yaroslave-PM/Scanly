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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md glass-card rounded-[36px] p-6 shadow-2xl border border-white/80 overflow-hidden">
        {/* Soft decorative bokeh */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#7CA875]/25 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full glass-pill hover:bg-white flex items-center justify-center text-[#2A4928] transition-colors shadow-xs"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Brand Kicker */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4A7A45] ring-2 ring-white" />
          <span className="text-xs font-bold tracking-wider text-[#4A6947] uppercase">
            Добро пожаловать в Scanly
          </span>
        </div>

        <h2 className="text-2xl font-black text-[#142C12] tracking-tight mb-2">
          Наведи камеру и сразу пойми: брать или нет
        </h2>

        <p className="text-xs sm:text-sm text-[#4E6B4B] mb-5 leading-relaxed font-medium">
          Персональный ассистент покупателя прямо у магазинной полки. Никаких лишних действий — только 1 мгновенный скан.
        </p>

        {/* 4 Superpowers in Frosted Glass Rows */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-2xl glass-pill shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#4A7A45] to-[#2E522B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ScanBarcode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#142C12]">1. Сканируй штрихкод</div>
              <div className="text-[11px] text-[#5A7758]">
                Распознаем продукт за полсекунды по камере смартфона
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl glass-pill shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#D8FF4F] text-[#071304] flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#142C12]">2. Читай AI-сводку отзывов</div>
              <div className="text-[11px] text-[#5A7758]">
                Искусственный интеллект выделит главное из сотен мнений
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl glass-pill shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#4A7A45] to-[#2E522B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#142C12]">3. Сравни цены офлайн-сетей</div>
              <div className="text-[11px] text-[#5A7758]">
                Пятёрочка, Магнит, Лента, Перекрёсток, ВкусВилл на карте
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl glass-pill shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#4A7A45] to-[#2E522B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#142C12]">4. Решай уверенно</div>
              <div className="text-[11px] text-[#5A7758]">
                Знаешь реальный состав, скрытые минусы и точную выгоду
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onStartScan();
            }}
            className="w-full h-13 rounded-2xl bg-linear-to-r from-[#4A7A45] to-[#2E522B] text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(45,85,41,0.3)] active:scale-[0.98] transition-all shadow-md"
          >
            <span>Начать сканирование</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full h-10 text-xs font-bold text-[#567554] hover:text-[#183116] transition-colors"
          >
            Перейти к каталогу
          </button>
        </div>
      </div>
    </div>
  );
};
