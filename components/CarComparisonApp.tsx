'use client';

import { useState } from 'react';
import { CarSelector, SelectedCar } from './CarSelector';
import { ComparisonTable } from './ComparisonTable';
import { ChatInterface } from './ChatInterface';
import { FindMyCarModal } from './FindMyCarModal';
import { carData } from '@/lib/car-data';
import { Sparkles, Search, Wand2, Lock, CarFront } from 'lucide-react';

export function CarComparisonApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [selectedCars, setSelectedCars] = useState<SelectedCar[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'carai') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50 p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center shadow-inner">
              <CarFront size={32} className="text-zinc-900" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-center text-zinc-900 mb-2 tracking-tight">Welcome to CarAI</h2>
          <p className="text-center text-zinc-500 mb-8 text-sm">Enter the password to access the next-gen car buying platform.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-zinc-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="Enter password..."
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all ${
                    loginError ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200'
                  }`}
                  autoFocus
                />
              </div>
              {loginError && <p className="text-red-500 text-xs mt-2 font-medium pl-1 animate-in slide-in-from-top-1">{loginError}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Unlock Access <Sparkles size={16} className="text-amber-400" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const toggleCarSelection = (carId: string, variantId: string) => {
    setSelectedCars(prev => {
      const isSelected = prev.some(sc => sc.carId === carId);
      if (isSelected) {
        return prev.filter(sc => sc.carId !== carId);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, { carId, variantId }];
      }
    });
  };

  const changeVariant = (carId: string, variantId: string) => {
    setSelectedCars(prev => 
      prev.map(sc => sc.carId === carId ? { ...sc, variantId } : sc)
    );
  };

  const filteredCars = carData.filter(car => 
    car.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCarData = carData.filter(car => selectedCars.some(sc => sc.carId === car.id));

  // Create a context array that includes only the selected variants
  const contextCarsWithVariants = selectedCarData.map(car => {
    const variantId = selectedCars.find(sc => sc.carId === car.id)?.variantId;
    const variant = car.variants.find(v => v.id === variantId);
    return {
      make: car.make,
      model: car.model,
      year: car.year,
      safetyRating: car.safetyRating,
      selectedVariant: variant
    };
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <header>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles size={14} className="text-amber-500" />
            Next-Gen Car Buying
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900">Find your perfect drive.</h1>
          <p className="text-zinc-500 mt-4 text-lg max-w-xl leading-relaxed">Select up to 3 cars to compare side-by-side, and ask our AI concierge any questions to help you decide.</p>
        </header>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">Select Cars</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-zinc-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search make or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-zinc-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 w-full sm:w-64"
                />
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-colors shadow-sm whitespace-nowrap"
              >
                <Wand2 size={16} />
                Find My Car
              </button>
            </div>
          </div>

          <CarSelector 
            cars={filteredCars} 
            selectedCars={selectedCars} 
            onToggle={toggleCarSelection} 
            onVariantChange={changeVariant}
          />
          
          {filteredCars.length === 0 && (
            <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl text-zinc-500">
              No cars found matching "{searchQuery}"
            </div>
          )}
        </section>

        {selectedCarData.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">
              {selectedCarData.length > 1 ? 'Comparison' : 'Car Overview'}
            </h2>
            <ComparisonTable cars={selectedCarData} selectedCars={selectedCars} />
          </section>
        )}
      </div>

      <div className="lg:col-span-1 h-[600px] lg:h-auto border border-zinc-200 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
        <ChatInterface contextCars={contextCarsWithVariants as any} allCars={carData} />
      </div>

      <FindMyCarModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        allCars={carData} 
      />
    </div>
  );
}
