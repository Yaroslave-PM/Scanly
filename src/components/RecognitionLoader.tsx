import React, { useEffect, useState } from 'react';
import { Check, Loader2, Sparkles, ScanBarcode } from 'lucide-react';
import { Product } from '../data/products';

interface RecognitionLoaderProps {
  product: Product;
  onComplete: () => void;
}

export const RecognitionLoader: React.FC<RecognitionLoaderProps> = ({
  product,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(0);

  const steps = [
    { title: 'Считываем штрихкод', detail: product.barcode },
    { title: 'Ищем товар в базе каталога', detail: 'База 140 000 товаров' },
    { title: 'Сверяем цены в 5 сетях', detail: 'Пятёрочка, Магнит, Лента...' },
    { title: 'Анализируем отзывы с AI', detail: `${product.reviewCount} оценок покупателей` },
  ];

  useEffect(() => {
    // Step progression
    const t1 = setTimeout(() => setStep(1), 350);
    const t2 = setTimeout(() => setStep(2), 750);
    const t3 = setTimeout(() => setStep(3), 1150);
    const t4 = setTimeout(() => {
      setStep(4);
      setTimeout(onComplete, 400);
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 glass-card-dark text-white rounded-[36px] relative overflow-hidden shadow-2xl border border-white/20">
      {/* Background glowing rings */}
      <div className="absolute w-72 h-72 rounded-full bg-[#D8FF4F]/10 blur-3xl animate-pulse pointer-events-none" />

      {/* Center Radar / Product Animation */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#D8FF4F]/50 animate-spin" />
        <div className="absolute w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
          <ScanBarcode className="w-10 h-10 text-[#D8FF4F]" />
        </div>
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xl text-xs font-bold text-[#D8FF4F] mb-3 border border-white/20 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Распознавание товара</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Определяем товар...
        </h2>
        <p className="text-xs text-emerald-100/70 mt-1 font-medium">
          Синхронизация цен и мнений покупателей
        </p>
      </div>

      {/* Step by Step Checklist in Frosted Glass Pills */}
      <div className="w-full max-w-xs space-y-2.5 relative z-10">
        {steps.map((s, index) => {
          const isDone = step > index;
          const isCurrent = step === index;

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                isDone
                  ? 'bg-white/15 text-white border border-white/30 shadow-xs'
                  : isCurrent
                  ? 'bg-[#D8FF4F]/20 text-[#D8FF4F] border border-[#D8FF4F]/60 scale-[1.02] shadow-md'
                  : 'bg-white/5 text-slate-400 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? 'bg-[#D8FF4F] text-[#071304]'
                      : isCurrent
                      ? 'bg-white/20 text-[#D8FF4F]'
                      : 'bg-white/10 text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  )}
                </div>

                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">
                    {s.title}
                  </div>
                  <div className="text-[10px] opacity-70">
                    {s.detail}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
