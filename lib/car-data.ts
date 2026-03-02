export interface CarVariant {
  id: string;
  name: string;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'EV';
  transmission: 'Manual' | 'Automatic';
  price: string;
  mileage: string;
  engine: string;
  horsepower: number;
  features: string[];
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  safetyRating: string;
  variants: CarVariant[];
}

export const carData: Car[] = [
  { 
    id: 'c1', make: 'Tata', model: 'Nexon', year: 2024, safetyRating: '5-Star Global NCAP',
    variants: [
      { id: 'v1_1', name: 'Smart', fuelType: 'Petrol', transmission: 'Manual', price: '₹8,15,000', mileage: '17.44 kmpl', engine: '1.2L Turbo Revotron', horsepower: 118, features: ['6 Airbags', 'LED DRLs', 'Multi-Drive Modes'] },
      { id: 'v1_2', name: 'Creative', fuelType: 'Diesel', transmission: 'Automatic', price: '₹13,00,000', mileage: '23.23 kmpl', engine: '1.5L Turbo Revotorq', horsepower: 113, features: ['10.25-in touchscreen', '360 Camera', 'Auto AC'] },
      { id: 'v1_3', name: 'Empowered', fuelType: 'EV', transmission: 'Automatic', price: '₹14,74,000', mileage: '465 km range', engine: 'Electric Motor', horsepower: 143, features: ['V2L Technology', 'Ventilated Seats', 'Arcade.ev'] }
    ]
  },
  { 
    id: 'c2', make: 'Mahindra', model: 'XUV700', year: 2024, safetyRating: '5-Star Global NCAP',
    variants: [
      { id: 'v2_1', name: 'MX', fuelType: 'Petrol', transmission: 'Manual', price: '₹13,99,000', mileage: '15.0 kmpl', engine: '2.0L mStallion Turbo', horsepower: 197, features: ['8-in Infotainment', 'Smart Door Handles', 'LED Taillamps'] },
      { id: 'v2_2', name: 'AX7 Luxury', fuelType: 'Diesel', transmission: 'Automatic', price: '₹23,99,000', mileage: '16.5 kmpl', engine: '2.2L mHawk Turbo', horsepower: 182, features: ['ADAS Level 2', 'Panoramic Sunroof', '3D Audio with 12 Speakers'] }
    ]
  },
  { 
    id: 'c3', make: 'Hyundai', model: 'Creta', year: 2024, safetyRating: '3-Star Global NCAP',
    variants: [
      { id: 'v3_1', name: 'E', fuelType: 'Petrol', transmission: 'Manual', price: '₹11,00,000', mileage: '17.4 kmpl', engine: '1.5L MPi', horsepower: 113, features: ['6 Airbags', 'Projector Headlamps', 'Digital Cluster'] },
      { id: 'v3_2', name: 'SX (O)', fuelType: 'Diesel', transmission: 'Automatic', price: '₹20,15,000', mileage: '19.1 kmpl', engine: '1.5L U2 CRDi', horsepower: 114, features: ['Voice Enabled Sunroof', 'Bose Premium Sound', '10.25-in display'] }
    ]
  },
  { 
    id: 'c4', make: 'Maruti Suzuki', model: 'Swift', year: 2024, safetyRating: '2-Star Global NCAP',
    variants: [
      { id: 'v4_1', name: 'LXi', fuelType: 'Petrol', transmission: 'Manual', price: '₹6,49,000', mileage: '24.8 kmpl', engine: '1.2L Z-Series', horsepower: 80, features: ['6 Airbags', 'Halogen Projector Headlamps', 'ESP'] },
      { id: 'v4_2', name: 'VXi', fuelType: 'CNG', transmission: 'Manual', price: '₹7,80,000', mileage: '32.85 km/kg', engine: '1.2L Z-Series CNG', horsepower: 69, features: ['7-in SmartPlay Pro', 'Steering Mounted Controls', 'Power Windows'] },
      { id: 'v4_3', name: 'ZXi+', fuelType: 'Petrol', transmission: 'Automatic', price: '₹9,64,000', mileage: '25.75 kmpl', engine: '1.2L Z-Series', horsepower: 80, features: ['9-in SmartPlay Pro+', 'Wireless Charging', 'Auto AC'] }
    ]
  },
  { 
    id: 'c5', make: 'Kia', model: 'Seltos', year: 2024, safetyRating: '3-Star Global NCAP',
    variants: [
      { id: 'v5_1', name: 'HTE', fuelType: 'Petrol', transmission: 'Manual', price: '₹10,90,000', mileage: '17.0 kmpl', engine: '1.5L Smartstream', horsepower: 113, features: ['6 Airbags', 'All Wheel Disc Brakes', 'Rear AC Vents'] },
      { id: 'v5_2', name: 'GTX+', fuelType: 'Diesel', transmission: 'Automatic', price: '₹20,30,000', mileage: '19.1 kmpl', engine: '1.5L CRDi VGT', horsepower: 114, features: ['Dual Screen Display', 'Bose 8-Speaker System', 'ADAS Level 2'] }
    ]
  }
];
