import { useSettings } from '@/hooks/useSettings';
import { useDepartures } from '@/hooks/useDepartures';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { SettingsPanel } from '@/components/SettingsPanel';
import { DepartureCard } from '@/components/DepartureCard';
import { GrandTotalCard } from '@/components/GrandTotalCard';
import { Button } from '@/components/ui/button';
import { Plus, Car, AlertCircle } from 'lucide-react';

const Index = () => {
  const { settings, updateSettings } = useSettings();
  const {
    departures,
    addDeparture,
    removeDeparture,
    updateDeparture,
    addIntermediateStop,
    removeIntermediateStop,
    updateAddress,
    grandTotal,
  } = useDepartures();

  const { isLoaded, loadError, calculateRoute } = useGoogleMaps(settings.googleMapsApiKey);

  const handleCalculate = async (departureId: string) => {
    const departure = departures.find((d) => d.id === departureId);
    if (!departure) return;

    updateDeparture(departureId, { isCalculating: true });

    const waypoints = departure.intermediateStops.map((s) => s.value);
    const result = await calculateRoute(
      departure.startAddress.value,
      departure.returnAddress.value,
      waypoints
    );

    if (result) {
      const fuelConsumption = (result.distance * settings.averageConsumption) / 100;
      const totalCost = fuelConsumption * settings.fuelPrice;

      updateDeparture(departureId, {
        distance: result.distance,
        fuelConsumption,
        totalCost,
        isCalculating: false,
      });
    } else {
      updateDeparture(departureId, { isCalculating: false });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header">
        <div className="container py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-foreground/10 backdrop-blur">
              <Car className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                Estimator Fonduri Rută
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Calculați costurile deplasărilor dumneavoastră
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid lg:grid-cols-[320px,1fr] gap-8">
          {/* Sidebar - Settings */}
          <aside className="space-y-6">
            <SettingsPanel
              settings={settings}
              onUpdate={updateSettings}
              isApiLoaded={isLoaded}
              apiError={loadError}
            />

            {!settings.googleMapsApiKey && (
              <div className="card-elevated p-4 border-l-4 border-warning">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Cheie API necesară
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Introduceți o cheie API Google Maps pentru a activa funcționalitățile de rutare și autocompletare.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content - Departures */}
          <div className="space-y-6">
            {/* Grand Total */}
            <GrandTotalCard
              distance={grandTotal.distance}
              fuelConsumption={grandTotal.fuelConsumption}
              totalCost={grandTotal.totalCost}
            />

            {/* Departures */}
            <div className="space-y-6">
              {departures.map((departure) => (
                <DepartureCard
                  key={departure.id}
                  departure={departure}
                  settings={settings}
                  isGoogleLoaded={isLoaded}
                  onUpdateAddress={(type, value, stopId) =>
                    updateAddress(departure.id, type, value, stopId)
                  }
                  onAddStop={() => addIntermediateStop(departure.id)}
                  onRemoveStop={(stopId) => removeIntermediateStop(departure.id, stopId)}
                  onRemove={() => removeDeparture(departure.id)}
                  onCalculate={() => handleCalculate(departure.id)}
                  canRemove={departures.length > 1}
                />
              ))}
            </div>

            {/* Add Departure Button */}
            <Button
              onClick={addDeparture}
              size="lg"
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-dashed border-border"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adaugă deplasare nouă
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container py-6">
          <p className="text-center text-sm text-muted-foreground">
            Estimator Fonduri Rută &copy; {new Date().getFullYear()} — Calculați eficient costurile deplasărilor
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
