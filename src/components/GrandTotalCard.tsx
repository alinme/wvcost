import { Route, Fuel, Banknote, TrendingUp, Backpack } from 'lucide-react';

interface GrandTotalProps {
  distance: number;
  fuelConsumption: number;
  totalCost: number;
  kits: number;
}

export function GrandTotalCard({ distance, fuelConsumption, totalCost, kits }: GrandTotalProps) {
  if (distance === 0 && kits === 0) return null;

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      <div className="bg-accent px-6 py-4 flex items-center gap-3">
        <TrendingUp className="h-5 w-5 text-accent-foreground" />
        <h3 className="font-semibold text-lg text-accent-foreground">Total General</h3>
      </div>
      
      <div className="p-6 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <Route className="h-6 w-6 text-primary" />
            </div>
            <p className="stat-value">{distance.toFixed(1)}</p>
            <p className="stat-label">Kilometri totali</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 mb-3">
              <Fuel className="h-6 w-6 text-warning" />
            </div>
            <p className="stat-value">{fuelConsumption.toFixed(1)}</p>
            <p className="stat-label">Litri combustibil</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-3">
              <Banknote className="h-6 w-6 text-success" />
            </div>
            <p className="stat-value">{totalCost.toFixed(0)}</p>
            <p className="stat-label">RON Total</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 mb-3">
              <Backpack className="h-6 w-6" />
            </div>
            <p className="stat-value">{kits.toFixed(0)}</p>
            <p className="stat-label">Kits totale</p>
          </div>
        </div>
      </div>
    </div>
  );
}
