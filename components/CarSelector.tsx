import { Car } from '@/lib/car-data';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectedCar {
  carId: string;
  variantId: string;
}

interface Props {
  cars: Car[];
  selectedCars: SelectedCar[];
  onToggle: (carId: string, variantId: string) => void;
  onVariantChange: (carId: string, variantId: string) => void;
}

export function CarSelector({ cars, selectedCars, onToggle, onVariantChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cars.map(car => {
        const selectedCar = selectedCars.find(sc => sc.carId === car.id);
        const isSelected = !!selectedCar;
        const isDisabled = !isSelected && selectedCars.length >= 3;
        const currentVariantId = selectedCar?.variantId || car.variants[0].id;
        
        return (
          <div
            key={car.id}
            className={`
              relative p-4 rounded-xl border transition-all flex flex-col gap-3
              ${isSelected ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-slate-200 bg-white hover:border-slate-300'}
              ${isDisabled ? 'opacity-50' : ''}
            `}
          >
            <div 
              className={`flex-1 cursor-pointer ${isDisabled ? 'cursor-not-allowed' : ''}`}
              onClick={() => !isDisabled && onToggle(car.id, currentVariantId)}
            >
              <div className="font-semibold text-slate-900">{car.make} {car.model}</div>
              <div className="text-sm text-slate-500">{car.year} • {car.safetyRating}</div>
              
              {isSelected && (
                <div className="absolute top-4 right-4 text-zinc-900">
                  <Check size={18} />
                </div>
              )}
            </div>

            <div className="mt-auto">
              <label className="block text-xs font-medium text-slate-500 mb-1">Select Variant & Fuel</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none text-sm border border-slate-300 rounded-md py-2 pl-3 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={currentVariantId}
                  onChange={(e) => {
                    if (isSelected) {
                      onVariantChange(car.id, e.target.value);
                    } else {
                      onToggle(car.id, e.target.value);
                    }
                  }}
                  disabled={isDisabled}
                >
                  {car.variants.map(variant => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name} ({variant.fuelType}, {variant.transmission}) - {variant.price}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
