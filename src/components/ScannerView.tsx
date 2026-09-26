import React, { useState, useRef, useEffect } from 'react';
import {
  ScanBarcode,
  Camera,
  Flashlight,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Product } from '../data/products';

interface ScannerViewProps {
  products: Product[];
  onScanSuccess: (product: Product) => void;
  onClose?: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  products,
  onScanSuccess,
  onClose,
}) => {
  const [scanMode, setScanMode] = useState<'barcode' | 'photo'>('barcode');
  const [torchOn, setTorchOn] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedPresetBarcode, setSelectedPresetBarcode] = useState<string>('4607025140019');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Play a quick beep sound on scan success
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pleasant A5 beep
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // AudioContext maybe restricted or unavailable
    }
  };

  // Try real camera on mount if available, otherwise gentle fallback
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCam = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCameraActive(true);
          }
        }
      } catch (err) {
        // Fallback to simulated high-fidelity viewfinder
        setCameraActive(false);
      }
    };

    startCam();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleTriggerScan = (targetProduct?: Product) => {
    const product =
      targetProduct ||
      products.find((p) => p.barcode === selectedPresetBarcode) ||
      products[0];

    playBeep();
    onScanSuccess(product);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Pick random or match
      handleTriggerScan();
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between glass-card-dark text-white rounded-[36px] overflow-hidden p-5 shadow-2xl border border-white/20">
      {/* Background ambient texture */}
      <div className="absolute inset-0 bg-radial from-[#183915] via-[#091C0B] to-[#040E05] opacity-90 pointer-events-none" />

      {/* Real Video Element or soft shelf backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
        />
        {!cameraActive && (
          <div
            className="w-full h-full bg-cover bg-center filter blur-md scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
        )}
      </div>

      {/* Top Controls Bar (Frosted Glass Buttons) */}
      <div className="relative z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white backdrop-blur-xl border border-white/20 transition-all shadow-xs"
              aria-label="Назад"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#D8FF4F] animate-ping" />
            <span className="text-xs font-bold text-[#D8FF4F]">Камера активна</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white backdrop-blur-xl border border-white/20 transition-all shadow-xs"
            title={soundEnabled ? 'Звук включен' : 'Звук выключен'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D8FF4F]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all shadow-xs ${
              torchOn
                ? 'bg-[#D8FF4F] text-[#071304]'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="Фонарик"
          >
            <Flashlight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setCameraActive((prev) => !prev);
            }}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white backdrop-blur-xl border border-white/20 transition-all shadow-xs"
            title="Переключить камеру"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Viewfinder / Reticle Area */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        {/* Helper instruction */}
        <div className="mb-4 text-center px-4">
          <div className="text-base font-extrabold text-white tracking-tight">
            {scanMode === 'barcode' ? 'Наведите камеру на штрихкод' : 'Сфотографируйте упаковку целиком'}
          </div>
          <div className="text-xs text-emerald-100/70 mt-1">
            Держите упаковку в пределах стеклянной рамки
          </div>
        </div>

        {/* Framing Box with Frosted Laser */}
        <div className="relative w-68 h-68 sm:w-76 sm:h-76 flex items-center justify-center">
          {/* 4 Glowing Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#D8FF4F] rounded-tl-2xl shadow-[0_0_14px_#D8FF4F]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#D8FF4F] rounded-tr-2xl shadow-[0_0_14px_#D8FF4F]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#D8FF4F] rounded-bl-2xl shadow-[0_0_14px_#D8FF4F]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#D8FF4F] rounded-br-2xl shadow-[0_0_14px_#D8FF4F]" />

          {/* Animated Laser Scanning Sweep */}
          <div className="absolute left-2 right-2 h-0.5 bg-[#D8FF4F] shadow-[0_0_16px_5px_#D8FF4F] animate-laser pointer-events-none" />

          {/* Center Graphic */}
          <div className="opacity-20 flex flex-col items-center text-white pointer-events-none">
            {scanMode === 'barcode' ? (
              <ScanBarcode className="w-24 h-24 stroke-1 text-[#D8FF4F]" />
            ) : (
              <Camera className="w-24 h-24 stroke-1 text-[#D8FF4F]" />
            )}
          </div>
        </div>

        {/* Quick Barcode Preset Selector (Frosted Pills) */}
        <div className="mt-5 w-full max-w-sm px-2">
          <div className="text-[11px] font-bold text-emerald-200/80 mb-1.5 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D8FF4F]" />
            <span>Тестовые товары у полки:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {products.map((p) => {
              const isSelected = selectedPresetBarcode === p.barcode;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPresetBarcode(p.barcode);
                    handleTriggerScan(p);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 backdrop-blur-md ${
                    isSelected
                      ? 'bg-[#D8FF4F] text-[#071304] font-black shadow-md border border-white'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  }`}
                >
                  <span>{p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}</span>
                  <span className="text-[10px] opacity-80 tabular-nums">{p.currentStore.price} ₽</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Area: Mode Switcher & Big Scan Button */}
      <div className="relative z-20 space-y-4">
        {/* Mode Switcher: Фото | Штрихкод */}
        <div className="flex items-center justify-center">
          <div className="p-1 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center gap-1">
            <button
              onClick={() => setScanMode('barcode')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                scanMode === 'barcode'
                  ? 'bg-[#D8FF4F] text-[#071304] shadow-xs'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              Штрихкод
            </button>
            <button
              onClick={() => setScanMode('photo')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                scanMode === 'photo'
                  ? 'bg-[#D8FF4F] text-[#071304] shadow-xs'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              Фото упаковки
            </button>
          </div>
        </div>

        {/* Action Buttons: Gallery Upload + Giant Scan Trigger */}
        <div className="flex items-center justify-between gap-3 px-2">
          {/* Gallery file picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-13 h-13 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white backdrop-blur-xl transition-all active:scale-95 shadow-xs"
            title="Загрузить из галереи"
          >
            <ImageIcon className="w-5 h-5 text-slate-200" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </button>

          {/* Main Scan Shutter Button */}
          <button
            onClick={() => handleTriggerScan()}
            className="flex-1 h-14 rounded-2xl bg-linear-to-r from-[#D8FF4F] to-[#bbf028] text-[#071304] font-black text-sm tracking-wide flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(216,255,79,0.5)] active:scale-[0.98] transition-all shadow-lg"
          >
            <ScanBarcode className="w-5 h-5" />
            <span>Распознать товар</span>
          </button>
        </div>
      </div>
    </div>
  );
};
