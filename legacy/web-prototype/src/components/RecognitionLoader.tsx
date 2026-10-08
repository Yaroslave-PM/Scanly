import React, { useEffect, useState } from 'react';
import { Sparkles, Scan, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product } from '../data/products';

interface RecognitionLoaderProps {
  product: Product;
  onFinish?: () => void;
  onComplete?: () => void;
}

export const RecognitionLoader: React.FC<RecognitionLoaderProps> = ({
  product,
  onFinish,
  onComplete,
}) => {
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'Считывание штрихкода и распознавание упаковки...', icon: Scan },
    { label: 'Сравнение цен в 12 сетях супермаркетов поблизости...', icon: Search },
    { label: 'Анализ честных отзывов и генерация AI-выжимки...', icon: Sparkles },
    { label: 'Проверка состава и расчет выгоды...', icon: ShieldCheck },
  ];

  const handleDone = () => {
    if (onComplete) onComplete();
    if (onFinish) onFinish();
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1200);
    const timer3 = setTimeout(() => setStep(3), 1700);
    const timer4 = setTimeout(() => handleDone(), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onFinish, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm glass-card rounded-[32px] p-6 text-center border border-white/80 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background inside card */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#22C55E]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#186426]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Thumbnail Preview */}
        <div className="relative mx-auto w-24 h-24 mb-5 rounded-2xl p-1 bg-white/80 border border-white shadow-md">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#186426] text-white shadow-md animate-bounce">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <h3 className="text-lg font-extrabold text-[#0B190A] mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-[#3D5A3A] font-medium mb-6">
          {product.volumeWeight} • {product.brand}
        </p>

        {/* Steps List */}
        <div className="space-y-3 text-left mb-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isDone = step > idx;
            const isCurrent = step === idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-white/90 border border-[#186426]/30 shadow-sm scale-[1.02]'
                    : isDone
                    ? 'bg-white/50 text-[#186426]'
                    : 'opacity-40 text-[#557352]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-[#186426] text-white'
                      : isCurrent
                      ? 'bg-[#EBF2E8] text-[#186426] animate-pulse'
                      : 'bg-black/5 text-gray-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs font-semibold leading-tight text-[#0B190A]">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#186426] to-[#22C55E] h-full transition-all duration-500 rounded-full"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
