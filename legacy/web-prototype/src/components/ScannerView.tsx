import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Flashlight,
  X,
  Sparkles,
  RefreshCw,
  Search,
  Upload,
  ScanLine,
} from 'lucide-react';
import { Product } from '../data/products';

interface ScannerViewProps {
  products: Product[];
  onScanSuccess?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onClose: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  products,
  onScanSuccess,
  onSelectProduct,
  onClose,
}) => {
  const [torchOn, setTorchOn] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [scanStatus, setScanStatus] = useState<string>('Наведите камеру на штрихкод или этикетку товара');
  const [isScanning, setIsScanning] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (product: Product) => {
    if (onScanSuccess) {
      onScanSuccess(product);
    } else if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  // Available sample products for instant interactive scanning
  const demoProducts = products.slice(0, 4);

  const handleSimulateScan = (product: Product) => {
    setIsScanning(false);
    setScanStatus(`Распознано: ${product.name}`);
    setTimeout(() => {
      handleSelect(product);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsScanning(false);
      setScanStatus('Анализ фото чека/товара через AI...');
      setTimeout(() => {
        // Pick top product or random
        const chosen = products[Math.floor(Math.random() * products.length)];
        handleSelect(chosen);
      }, 1000);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 z-20">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-[#0B190A] hover:bg-white/80 transition-all shadow-sm"
          aria-label="Закрыть сканер"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-card border border-white/60 text-xs font-semibold text-[#0B190A] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#186426] animate-pulse" />
          <span>Умный сканер Scanly</span>
        </div>

        <button
          onClick={() => setTorchOn(!torchOn)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
            torchOn
              ? 'bg-[#186426] text-white shadow-lg shadow-[#186426]/30'
              : 'glass-pill text-[#0B190A] hover:bg-white/80'
          }`}
          aria-label="Вспышка"
        >
          <Flashlight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scanner Viewfinder Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-2 relative z-10">
        <div className="w-full max-w-sm aspect-[4/5] relative rounded-[32px] overflow-hidden glass-card-dark border-2 border-white/30 shadow-2xl flex flex-col items-center justify-center p-6">
          {/* Simulated Camera feed backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 pointer-events-none" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Viewfinder Frame */}
          <div className="relative w-64 h-64 border-2 border-white/30 rounded-2xl flex flex-col items-center justify-center p-4">
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#22C55E] rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#22C55E] rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#22C55E] rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#22C55E] rounded-br-lg" />

            {/* Laser Scanning Animation Line */}
            {isScanning && (
              <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_12px_#22C55E] animate-scan-laser pointer-events-none" />
            )}

            {/* Reticle icon */}
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 animate-pulse">
              <ScanLine className="w-10 h-10" />
            </div>

            <p className="mt-4 text-xs font-medium text-white/90 text-center px-2">
              Штрихкод, ценник или этикетка
            </p>
          </div>

          {/* Status Message */}
          <div className="absolute bottom-5 inset-x-6">
            <div className="glass-card py-2.5 px-4 rounded-2xl text-center border border-white/40 shadow-lg">
              <p className="text-xs font-semibold text-[#0B190A] leading-snug">
                {scanStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Quick action buttons below viewfinder */}
        <div className="flex items-center gap-3 mt-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-card hover:bg-white/90 text-xs font-semibold text-[#0B190A] transition-all shadow-sm"
          >
            <Upload className="w-4 h-4 text-[#186426]" />
            <span>Загрузить фото / чек</span>
          </button>
        </div>
      </div>

      {/* Preset demo barcodes to tap and simulate */}
      <div className="px-5 z-20">
        <div className="glass-card rounded-[24px] p-4 border border-white/70 shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D5A3A]">
              Быстрый тест (кликните товар для сканирования):
            </span>
            <span className="text-[10px] text-[#557352]">
              {demoProducts.length} образца
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSimulateScan(p)}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 hover:bg-white border border-white/60 hover:border-[#186426]/30 text-left transition-all active:scale-95 group shadow-xs"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border border-black/5"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#0B190A] truncate group-hover:text-[#186426]">
                    {p.name}
                  </p>
                  <p className="text-[11px] font-extrabold text-[#186426]">
                    от {p.cheapestStore.price} ₽
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
