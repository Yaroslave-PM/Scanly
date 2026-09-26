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
    <div className="min-h-screen relative overflow-x-hidden bg-linear-to-b from-[#E7EFE6] via-[#EFF6EE] to-[#DEEAD9] text-[#162B16] selection:bg-[#4A7A45] selection:text-white flex flex-col items-center justify-start">
      {/* Organic Botanical Ambient Backdrop (Simulating the soft depth-of-field foliage in the reference) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft leaf silhouettes and ambient light blobs */}
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-[#7CA875]/35 blur-[90px]" />
        <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-[#9AC492]/30 blur-[100px]" />
        <div className="absolute top-2/3 -left-28 w-[420px] h-[420px] rounded-full bg-[#52844D]/25 blur-[110px]" />
        <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-[#A2CCA0]/35 blur-[95px]" />
        
        {/* Subtle decorative leaf shapes */}
        <svg
          className="absolute -top-12 -right-12 w-80 h-80 opacity-20 text-[#3F6B38] filter blur-xl"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M45,-78.3C57.4,-70.8,65.8,-56.9,72.9,-42.6C80,-28.3,85.8,-13.6,84.9,0.5C83.9,14.6,76.3,28.2,67.6,40.9C58.8,53.6,49,65.4,36.5,72.6C24,79.8,8.8,82.4,-6.5,80.5C-21.8,78.6,-37.2,72.2,-49.6,63.1C-62,54,-71.4,42.2,-77.6,28.8C-83.8,15.4,-86.8,0.4,-83.4,-13C-80,-26.4,-70.2,-38.2,-58.8,-46.8C-47.4,-55.4,-34.4,-60.8,-21.5,-68.2C-8.6,-75.6,4.2,-85,19.3,-85.7C34.4,-86.4,51.8,-78.4,45,-78.3Z" transform="translate(100 100)" />
        </svg>

        <svg
          className="absolute top-1/2 -left-24 w-96 h-96 opacity-15 text-[#2C5226] filter blur-2xl"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M37.8,-64.7C49.9,-58.5,61.4,-50,68.9,-38.6C76.4,-27.2,79.9,-12.9,79.3,1.4C78.7,15.7,74,30.1,65.8,42.4C57.6,54.7,45.9,64.9,32.7,70.8C19.5,76.7,4.8,78.3,-10.1,76.5C-25,74.7,-40.1,69.5,-52.1,60.3C-64.1,51.1,-73,37.9,-77.9,23.3C-82.8,8.7,-83.7,-7.3,-78.6,-21.7C-73.5,-36.1,-62.4,-48.9,-49.3,-54.9C-36.2,-60.9,-21.1,-60.1,-6.6,-59.8C7.9,-59.5,25.7,-70.9,37.8,-64.7Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Top Banner for Desktop Testers (Frosted glass strip) */}
      <div className="w-full glass-card py-2 px-4 flex items-center justify-between text-xs border-b border-white/60 z-50 sticky top-0 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4A7A45] ring-2 ring-white animate-pulse" />
          <span className="font-extrabold tracking-wider text-xs text-[#1D3D1B]">
            SCANLY
          </span>
          <span className="hidden sm:inline text-[#769374]">·</span>
          <span className="hidden sm:inline text-[#4A6348] font-medium">
            Персональный ассистент при покупке продуктов
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill hover:bg-white/80 text-[#294827] font-semibold transition-all shadow-xs"
          >
            <Info className="w-3.5 h-3.5 text-[#4A7A45]" />
            <span className="hidden xs:inline">Как это работает</span>
          </button>

          <button
            onClick={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill hover:bg-white/80 text-[#1D3D1B] font-semibold transition-all shadow-xs"
            title="Переключить рамку смартфона"
          >
            {isPhoneFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#4A7A45]" />
                <span className="text-[11px]">На весь экран</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#4A7A45]" />
                <span className="text-[11px]">Режим смартфона</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container (Responsive Mobile Canvas) */}
      <main
        className={`w-full relative z-10 transition-all duration-300 ${
          isPhoneFrameMode
            ? 'max-w-[420px] my-5 rounded-[44px] shadow-[0_25px_60px_rgba(20,45,22,0.22)] border-[10px] border-white/80 glass-card min-h-[850px] overflow-hidden'
            : 'max-w-md mx-auto px-4 py-4'
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

        {/* Floating Bottom Nav (hidden in scanner or recognition view for immersive experience) */}
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
