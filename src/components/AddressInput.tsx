/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isGoogleLoaded: boolean;
  onRemove?: () => void;
  showRemove?: boolean;
}

export function AddressInput({
  value,
  onChange,
  placeholder,
  isGoogleLoaded,
  onRemove,
  showRemove = false,
}: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [localValue, setLocalValue] = useState(value);

  // Keep local value in sync with prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Setup autocomplete (legacy Autocomplete – works reliably)
  useEffect(() => {
    if (!isGoogleLoaded || !window.google?.maps?.places || !inputRef.current) {
      return;
    }

    if (autocompleteRef.current) {
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'ro' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        setLocalValue(place.formatted_address);
        onChange(place.formatted_address);
      } else if (place?.name) {
        setLocalValue(place.name);
        onChange(place.name);
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isGoogleLoaded, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  }, [onChange]);

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
        <Input
          ref={inputRef}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10 bg-background border-input focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {showRemove && onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
