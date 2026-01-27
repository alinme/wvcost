/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || !window.google?.maps?.places) {
      return;
    }

    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'ro' },
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        setLocalValue(place.formatted_address);
        onChange(place.formatted_address);
      } else if (place?.name) {
        setLocalValue(place.name);
        onChange(place.name);
      }
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isGoogleLoaded, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
