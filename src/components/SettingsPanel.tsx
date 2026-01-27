import { Settings, fuelTypes } from '@/types/route';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressInput } from '@/components/AddressInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings as SettingsIcon, Key, Fuel, Gauge, DollarSign, Home } from 'lucide-react';

interface SettingsPanelProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
  isApiLoaded: boolean;
  apiError: string | null;
}

export function SettingsPanel({ settings, onUpdate, isApiLoaded, apiError }: SettingsPanelProps) {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <SettingsIcon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="section-title">Setări</h2>
      </div>

      <div className="grid gap-5">
        {/* Home Address */}
        <div className="space-y-1.5">
          <Label className="input-label flex items-center gap-2">
            <Home className="h-3.5 w-3.5 shrink-0 inline-flex" />
            Adresă domiciliu
          </Label>
          <AddressInput
            value={settings.homeAddress}
            onChange={(v) => onUpdate({ homeAddress: v })}
            placeholder="Opțional – folosiți „Domiciliu” la plecare/întoarcere"
            isGoogleLoaded={isApiLoaded}
          />
        </div>

        {/* API Key */}
        <div className="space-y-1.5">
          <Label htmlFor="apiKey" className="input-label flex items-center gap-2">
            <Key className="h-3.5 w-3.5 shrink-0 inline-flex" />
            Cheie API Google Maps
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={settings.googleMapsApiKey}
            onChange={(e) => onUpdate({ googleMapsApiKey: e.target.value })}
            placeholder="Introduceți cheia API..."
            className="font-mono text-sm"
          />
          {apiError && (
            <p className="text-sm text-destructive mt-1">{apiError}</p>
          )}
          {isApiLoaded && (
            <p className="text-sm text-success mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success" />
              API conectat cu succes
            </p>
          )}
        </div>

        {/* Fuel Type */}
        <div className="space-y-1.5">
          <Label htmlFor="fuelType" className="input-label flex items-center gap-2">
            <Fuel className="h-3.5 w-3.5 shrink-0 inline-flex" />
            Tip combustibil
          </Label>
          <Select value={settings.fuelType} onValueChange={(v) => onUpdate({ fuelType: v })}>
            <SelectTrigger id="fuelType" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border">
              {fuelTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Price */}
        <div className="space-y-1.5">
          <Label htmlFor="fuelPrice" className="input-label flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5 shrink-0 inline-flex" />
            Preț combustibil (RON/litru)
          </Label>
          <Input
            id="fuelPrice"
            type="number"
            step="0.01"
            min="0"
            value={settings.fuelPrice}
            onChange={(e) => onUpdate({ fuelPrice: parseFloat(e.target.value) || 0 })}
            className="bg-background"
          />
        </div>

        {/* Average Consumption */}
        <div className="space-y-1.5">
          <Label htmlFor="consumption" className="input-label flex items-center gap-2">
            <Gauge className="h-3.5 w-3.5 shrink-0 inline-flex" />
            Consum mediu (litri/100km)
          </Label>
          <Input
            id="consumption"
            type="number"
            step="0.1"
            min="0"
            value={settings.averageConsumption}
            onChange={(e) => onUpdate({ averageConsumption: parseFloat(e.target.value) || 0 })}
            className="bg-background"
          />
        </div>
      </div>
    </div>
  );
}
