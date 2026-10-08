/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, Product, Review } from './data/products';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { ScannerView } from './components/ScannerView';
import { RecognitionLoader } from './components/RecognitionLoader';
import { ProductCardView } from './components/ProductCardView';
import { NearbyStoresMap } from './components/NearbyStoresMap';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { OnboardingModal } from './components/OnboardingModal';
import { CityModal } from './components/CityModal';
import { WriteReviewModal } from './components/WriteReviewModal';
import { Smartphone, Monitor, Info } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('scanly_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [selectedCity, setSelectedCity] = useState<string>('Ростов-на-Дону');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeView, setActiveView] = useState<'main' | 'scanner' | 'recognition' | 'product' | 'map'>('main');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [pendingScanProduct, setPendingScanProduct] = useState<Product>(products[0]);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('scanly_products', JSON.stringify(products));
  }, [products]);

  // First-time visit onboarding check
  useEffect(() => {
    const visited = localStorage.getItem('scanly_visited');
    if (!visited) {
      setIsOnboardingOpen(true);
      localStorage.setItem('scanly_visited', 'true');
    }
  }, []);

  const handleToggleFavorite = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartScan = (targetProduct?: Product) => {
    const prod = targetProduct || products[0];
    setPendingScanProduct(prod);
    setActiveView('recognition');
  };

  const handleRecognitionComplete = () => {
    setSelectedProduct(pendingScanProduct);
    setActiveView('product');
  };

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'scanner') {
      setActiveView('scanner');
    } else {
      setActiveView('main');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReview = (newReview: Review) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === selectedProduct.id) {
          const updatedReviews = [newReview, ...p.reviews];
          const newAvgRating = Number(
            (
              updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
              updatedReviews.length
            ).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: p.reviewCount + 1,
            rating: newAvgRating,
          };
        }
        return p;
      })
    );

    setSelectedProduct((prev) => {
      const updatedReviews = [newReview, ...prev.reviews];
      const newAvgRating = Number(
        (
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
          updatedReviews.length
        ).toFixed(1)
      );
      return {
        ...prev,
        reviews: updatedReviews,
        reviewCount: prev.reviewCount + 1,
        rating: newAvgRating,
      };
    });
  };

  const favoritesCount = products.filter((p) => p.isFavorite).length;

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#EBF2E8] text-[#0B190A] flex flex-col items-center justify-start">
      {/* Dynamic Nature Glass Ambient Background Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 -left-20 w-80 h-80 rounded-full bg-[#B2D6A4]/35 blur-[90px]" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-[#D8FF4F]/20 blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-[#82B379]/30 blur-[90px]" />
      </div>

      {/* Top Bar for Desktop Testers */}
      <header className="w-full glass-card py-2.5 px-4 flex items-center justify-between text-xs border-b border-white/70 z-50 sticky top-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#254F22] ring-2 ring-[#D8FF4F]" />
          <span className="font-black tracking-tight text-sm text-[#071707]">
            Scanly
          </span>
          <span className="hidden sm:inline text-[#4F754A]">/</span>
          <span className="hidden sm:inline text-[#274426] font-semibold">
            Персональный ассистент покупателя
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill hover:bg-white text-[#0E260D] font-bold shadow-xs transition-all"
          >
            <Info className="w-3.5 h-3.5 text-[#254F22]" />
            <span className="hidden xs:inline">Как это работает</span>
          </button>

          <button
            onClick={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill hover:bg-white text-[#0E260D] font-bold shadow-xs transition-all"
            title="Переключить рамку смартфона"
          >
            {isPhoneFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#254F22]" />
                <span className="text-xs">Широкий экран</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#254F22]" />
                <span className="text-xs">Рамка смартфона</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        className={`w-full relative z-10 transition-all duration-300 ${
          isPhoneFrameMode
            ? 'max-w-[420px] my-6 rounded-[44px] shadow-[0_24px_60px_rgba(20,50,22,0.18)] border-4 border-white/90 bg-[#EBF2E8] min-h-[850px] overflow-hidden p-4 ring-1 ring-black/5'
            : 'max-w-md mx-auto px-4 py-5'
        }`}
      >
        {/* Onboarding Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onStartScan={() => {
            setActiveView('scanner');
            setActiveTab('scanner');
          }}
        />

        {/* City Selector Modal */}
        <CityModal
          isOpen={isCityModalOpen}
          selectedCity={selectedCity}
          onSelectCity={(city) => setSelectedCity(city)}
          onClose={() => setIsCityModalOpen(false)}
        />

        {/* Write Review Modal */}
        <WriteReviewModal
          product={selectedProduct}
          isOpen={isWriteReviewOpen}
          onClose={() => setIsWriteReviewOpen(false)}
          onSubmitReview={handleAddReview}
        />

        {/* View Routing */}
        {activeView === 'scanner' && (
          <ScannerView
            products={products}
            onScanSuccess={(prod) => handleStartScan(prod)}
            onClose={() => {
              setActiveView('main');
              setActiveTab('home');
            }}
          />
        )}

        {activeView === 'recognition' && (
          <RecognitionLoader
            product={pendingScanProduct}
            onComplete={handleRecognitionComplete}
          />
        )}

        {activeView === 'product' && (
          <ProductCardView
            product={selectedProduct}
            onBack={() => {
              setActiveView('main');
            }}
            onToggleFavorite={handleToggleFavorite}
            onOpenWriteReview={() => setIsWriteReviewOpen(true)}
            onOpenMap={() => setActiveView('map')}
          />
        )}

        {activeView === 'map' && (
          <NearbyStoresMap
            product={selectedProduct}
            selectedCity={selectedCity}
            onClose={() => setActiveView('product')}
          />
        )}

        {activeView === 'main' && (
          <>
            {activeTab === 'home' && (
              <HomeView
                products={products}
                selectedCity={selectedCity}
                onOpenCityModal={() => setIsCityModalOpen(true)}
                onOpenSearch={(initialQuery) => {
                  setSearchInitialQuery(initialQuery || '');
                  setActiveTab('search');
                }}
                onOpenScanner={() => {
                  setActiveView('scanner');
                  setActiveTab('scanner');
                }}
                onSelectProduct={handleSelectProduct}
                onToggleFavorite={handleToggleFavorite}
                onOpenProfile={() => setActiveTab('profile')}
              />
            )}

            {activeTab === 'search' && (
              <SearchView
                products={products}
                initialQuery={searchInitialQuery}
                onSelectProduct={handleSelectProduct}
                onToggleFavorite={handleToggleFavorite}
                onOpenScanner={() => {
                  setActiveView('scanner');
                  setActiveTab('scanner');
                }}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoritesView
                products={products}
                onSelectProduct={handleSelectProduct}
                onToggleFavorite={handleToggleFavorite}
                onOpenScanner={() => {
                  setActiveView('scanner');
                  setActiveTab('scanner');
                }}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                products={products}
                selectedCity={selectedCity}
                onOpenCityModal={() => setIsCityModalOpen(true)}
                onOpenFavorites={() => setActiveTab('favorites')}
                onSelectProduct={handleSelectProduct}
              />
            )}
          </>
        )}

        {/* Floating Glass Bottom Nav */}
        {activeView !== 'scanner' && activeView !== 'recognition' && (
          <BottomNavBar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            favoritesCount={favoritesCount}
          />
        )}
      </main>
    </div>
  );
}
