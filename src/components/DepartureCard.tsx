import { Departure, Settings } from '@/types/route';
import { Button } from '@/components/ui/button';
import { AddressInput } from './AddressInput';
import { RouteMap } from './RouteMap';
import {
  MapPin,
  Flag,
  RotateCcw,
  Plus,
  Trash2,
  Calculator,
  Route,
  Fuel,
  Banknote,
  Loader2,
  ChevronDown,
  ChevronUp,
  Backpack,
} from 'lucide-react';

interface DepartureCardProps {
  departure: Departure;
  settings: Settings;
  isGoogleLoaded: boolean;
  homeAddress: string;
  onUpdateAddress: (type: 'start' | 'return' | 'intermediate', value: string, stopId?: string) => void;
  onAddStop: () => void;
  onRemoveStop: (stopId: string) => void;
  onUpdateStopKits: (stopId: string, kits: number) => void;
  onRemove: () => void;
  onCalculate: () => void;
  onToggleCollapse: () => void;
  canRemove: boolean;
}

export function DepartureCard({
  departure,
  settings,
  isGoogleLoaded,
  homeAddress,
  onUpdateAddress,
  onAddStop,
  onRemoveStop,
  onUpdateStopKits,
  onRemove,
  onCalculate,
  onToggleCollapse,
  canRemove,
}: DepartureCardProps) {
  const hasAddresses =
    departure.startAddress.value.trim() && departure.returnAddress.value.trim();
  const isCollapsed = departure.isCollapsed ?? false;

  const totalKits =
    departure.intermediateStops?.reduce(
      (acc, stop) => acc + (stop.kits || 0),
      0
    ) ?? 0;

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="gradient-header px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Route className="h-5 w-5 shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-lg">{departure.name}</h3>
            {isCollapsed && (
              <div className="text-sm text-primary-foreground/80 flex items-center gap-3 mt-0.5">
                {departure.distance != null ? (
                  <>
                    <span className="truncate">
                      {departure.distance.toFixed(1)} km ·{' '}
                      {departure.totalCost?.toFixed(0) ?? '-'} RON
                    </span>
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <Backpack className="h-3.5 w-3.5" />
                      <span>{totalKits}</span>
                    </span>
                  </>
                ) : departure.startAddress.value || departure.returnAddress.value ? (
                  <span className="truncate">
                    {departure.startAddress.value || '…'} →{' '}
                    {departure.returnAddress.value || '…'}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            title={isCollapsed ? 'Deschide' : 'Minimizează'}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
          {canRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6 space-y-5">
          {/* Start Address */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="input-label flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 inline-flex text-success" />
                Adresă plecare
              </label>
              {homeAddress.trim() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onUpdateAddress('start', homeAddress)}
                >
                  Domiciliu
                </Button>
              )}
            </div>
            <AddressInput
              value={departure.startAddress.value}
              onChange={(v) => onUpdateAddress('start', v)}
              placeholder="Introduceți adresa de plecare..."
              isGoogleLoaded={isGoogleLoaded}
            />
          </div>

          {/* Intermediate Stops */}
          {departure.intermediateStops.length > 0 && (
            <div className="space-y-3">
              <label className="input-label flex items-center gap-2">
                <Flag className="h-3.5 w-3.5 shrink-0 inline-flex text-warning" />
                Opriri intermediare
              </label>
              {departure.intermediateStops.map((stop, index) => (
                <AddressInput
                  key={stop.id}
                  value={stop.value}
                  onChange={(v) => onUpdateAddress('intermediate', v, stop.id)}
                  placeholder={`Oprirea ${index + 1}...`}
                  isGoogleLoaded={isGoogleLoaded}
                  kits={stop.kits ?? 0}
                  onKitsChange={(kits) => onUpdateStopKits(stop.id, kits)}
                  showRemove
                  onRemove={() => onRemoveStop(stop.id)}
                />
              ))}
            </div>
          )}

          {/* Add Stop Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddStop}
            className="w-full border-dashed hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adaugă oprire intermediară
          </Button>

          {/* Return Address */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="input-label flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 shrink-0 inline-flex text-primary" />
                Adresă întoarcere
              </label>
              {homeAddress.trim() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onUpdateAddress('return', homeAddress)}
                >
                  Domiciliu
                </Button>
              )}
            </div>
            <AddressInput
              value={departure.returnAddress.value}
              onChange={(v) => onUpdateAddress('return', v)}
              placeholder="Introduceți adresa de întoarcere..."
              isGoogleLoaded={isGoogleLoaded}
            />
          </div>

          {/* Calculate Button */}
          <Button
            onClick={onCalculate}
            disabled={!hasAddresses || !isGoogleLoaded || departure.isCalculating}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {departure.isCalculating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Se calculează...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculează ruta
              </>
            )}
          </Button>

          {/* Results */}
          {departure.distance !== null && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Route className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="stat-value text-lg">{departure.distance.toFixed(1)}</p>
                <p className="stat-label">km</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Fuel className="h-5 w-5 mx-auto mb-1 text-warning" />
                <p className="stat-value text-lg">{departure.fuelConsumption?.toFixed(1)}</p>
                <p className="stat-label">litri</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Banknote className="h-5 w-5 mx-auto mb-1 text-success" />
                <p className="stat-value text-lg">{departure.totalCost?.toFixed(0)}</p>
                <p className="stat-label">RON</p>
              </div>
            </div>
          )}

          {/* Map Preview */}
          <RouteMap departure={departure} isGoogleLoaded={isGoogleLoaded} />
        </div>
      )}
    </div>
  );
}
