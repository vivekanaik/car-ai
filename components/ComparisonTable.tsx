import { Car, CarVariant } from '@/lib/car-data';
import { SelectedCar } from './CarSelector';

interface Props {
  cars: Car[];
  selectedCars: SelectedCar[];
}

export function ComparisonTable({ cars, selectedCars }: Props) {
  if (cars.length === 0) return null;

  const features = [
    { label: 'Price', key: 'price' as keyof CarVariant },
    { label: 'Fuel Type', key: 'fuelType' as keyof CarVariant },
    { label: 'Transmission', key: 'transmission' as keyof CarVariant },
    { label: 'Engine', key: 'engine' as keyof CarVariant },
    { label: 'Horsepower', key: 'horsepower' as keyof CarVariant },
    { label: 'Mileage', key: 'mileage' as keyof CarVariant },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
          <tr>
            <th className="p-4 font-medium">Feature</th>
            {cars.map(car => {
              const variantId = selectedCars.find(sc => sc.carId === car.id)?.variantId;
              const variant = car.variants.find(v => v.id === variantId);
              return (
                <th key={car.id} className="p-4 font-semibold">
                  <div>{car.make} {car.model}</div>
                  <div className="text-xs font-normal text-slate-500 mt-1">{variant?.name} Variant</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {features.map((feature) => (
            <tr key={feature.key} className="hover:bg-slate-50/50">
              <td className="p-4 font-medium text-slate-700">{feature.label}</td>
              {cars.map(car => {
                const variantId = selectedCars.find(sc => sc.carId === car.id)?.variantId;
                const variant = car.variants.find(v => v.id === variantId);
                return (
                  <td key={car.id} className="p-4 text-slate-600">
                    {variant?.[feature.key]}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="hover:bg-slate-50/50">
            <td className="p-4 font-medium text-slate-700">Safety Rating</td>
            {cars.map(car => (
              <td key={car.id} className="p-4 text-slate-600">
                {car.safetyRating}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-slate-50/50">
            <td className="p-4 font-medium text-slate-700">Key Features</td>
            {cars.map(car => {
              const variantId = selectedCars.find(sc => sc.carId === car.id)?.variantId;
              const variant = car.variants.find(v => v.id === variantId);
              return (
                <td key={car.id} className="p-4 text-slate-600">
                  <ul className="list-disc list-inside space-y-1">
                    {variant?.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
