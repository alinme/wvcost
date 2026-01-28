import { useState, useCallback, useEffect } from 'react';
import { Departure, Address } from '@/types/route';

const generateId = () => Math.random().toString(36).substring(2, 9);

const createEmptyAddress = (): Address => ({
  id: generateId(),
  value: '',
  kits: 0,
});

const createEmptyDeparture = (index: number): Departure => ({
  id: generateId(),
  name: `Deplasare ${index}`,
  startAddress: createEmptyAddress(),
  intermediateStops: [],
  returnAddress: createEmptyAddress(),
  distance: null,
  fuelConsumption: null,
  totalCost: null,
  isCalculating: false,
  isCollapsed: false,
});

const DEPARTURES_KEY = 'route-estimator-departures';

function loadDepartures(): Departure[] {
  try {
    const raw = localStorage.getItem(DEPARTURES_KEY);
    if (!raw) return [createEmptyDeparture(1)];
    const parsed = JSON.parse(raw) as Departure[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [createEmptyDeparture(1)];
    return parsed.map((d) => ({
      ...d,
      isCollapsed: d.isCollapsed ?? false,
      isCalculating: false,
    }));
  } catch {
    return [createEmptyDeparture(1)];
  }
}

function saveDepartures(departures: Departure[]) {
  try {
    localStorage.setItem(DEPARTURES_KEY, JSON.stringify(departures));
  } catch {
    /* ignore */
  }
}

export function useDepartures() {
  const [departures, setDepartures] = useState<Departure[]>(loadDepartures);

  useEffect(() => {
    saveDepartures(departures);
  }, [departures]);

  const addDeparture = useCallback(() => {
    setDepartures((prev) => [...prev, createEmptyDeparture(prev.length + 1)]);
  }, []);

  const removeDeparture = useCallback((id: string) => {
    setDepartures(prev => {
      const filtered = prev.filter(d => d.id !== id);
      return filtered.map((d, i) => ({ ...d, name: `Deplasare ${i + 1}` }));
    });
  }, []);

  const updateDeparture = useCallback((id: string, updates: Partial<Departure>) => {
    setDepartures(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updates } : d))
    );
  }, []);

  const addIntermediateStop = useCallback((departureId: string) => {
    setDepartures(prev =>
      prev.map(d =>
        d.id === departureId
          ? { ...d, intermediateStops: [...d.intermediateStops, createEmptyAddress()] }
          : d
      )
    );
  }, []);

  const removeIntermediateStop = useCallback((departureId: string, stopId: string) => {
    setDepartures(prev =>
      prev.map(d =>
        d.id === departureId
          ? { ...d, intermediateStops: d.intermediateStops.filter(s => s.id !== stopId) }
          : d
      )
    );
  }, []);

  const updateAddress = useCallback(
    (departureId: string, type: 'start' | 'return' | 'intermediate', value: string, stopId?: string) => {
      setDepartures(prev =>
        prev.map(d => {
          if (d.id !== departureId) return d;
          if (type === 'start') {
            return { ...d, startAddress: { ...d.startAddress, value } };
          }
          if (type === 'return') {
            return { ...d, returnAddress: { ...d.returnAddress, value } };
          }
          return {
            ...d,
            intermediateStops: d.intermediateStops.map(s =>
              s.id === stopId ? { ...s, value } : s
            ),
          };
        })
      );
    },
    []
  );

  const updateStopKits = useCallback(
    (departureId: string, stopId: string, kits: number) => {
      setDepartures((prev) =>
        prev.map((d) =>
          d.id === departureId
            ? {
                ...d,
                intermediateStops: d.intermediateStops.map((s) =>
                  s.id === stopId ? { ...s, kits } : s
                ),
              }
            : d
        )
      );
    },
    []
  );

  const grandTotal = departures.reduce(
    (acc, d) => {
      const departureKits = d.intermediateStops?.reduce(
        (kitsAcc, stop) => kitsAcc + (stop.kits || 0),
        0
      );

      return {
        distance: acc.distance + (d.distance || 0),
        fuelConsumption: acc.fuelConsumption + (d.fuelConsumption || 0),
        totalCost: acc.totalCost + (d.totalCost || 0),
        kits: acc.kits + departureKits,
      };
    },
    { distance: 0, fuelConsumption: 0, totalCost: 0, kits: 0 }
  );

  return {
    departures,
    addDeparture,
    removeDeparture,
    updateDeparture,
    addIntermediateStop,
    removeIntermediateStop,
    updateAddress,
    updateStopKits,
    grandTotal,
  };
}
