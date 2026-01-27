export interface Address {
  id: string;
  value: string;
  placeId?: string;
}

export interface Departure {
  id: string;
  name: string;
  startAddress: Address;
  intermediateStops: Address[];
  returnAddress: Address;
  distance: number | null;
  fuelConsumption: number | null;
  totalCost: number | null;
  isCalculating: boolean;
  isCollapsed?: boolean;
}

export interface Settings {
  googleMapsApiKey: string;
  fuelPrice: number;
  fuelType: string;
  averageConsumption: number;
  homeAddress: string;
}

export const defaultSettings: Settings = {
  googleMapsApiKey: '',
  fuelPrice: 7.5,
  fuelType: 'Motorină',
  averageConsumption: 7.5,
  homeAddress: '',
};

export const fuelTypes = [
  'Motorină',
  'Benzină 95',
  'Benzină 98',
  'GPL',
];
