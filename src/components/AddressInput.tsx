/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState, forwardRef } from 'react';
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

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  function AddressInput(
    {
      value,
      onChange,
      placeholder,
      isGoogleLoaded,
      onRemove,
      showRemove = false,
    },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const autocompleteElementRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
    const [localValue, setLocalValue] = useState(value);
    const [useNewApi, setUseNewApi] = useState(true);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    useEffect(() => {
      if (!isGoogleLoaded || !window.google?.maps?.places) {
        return;
      }

      // Check if the new PlaceAutocompleteElement API is available
      if (useNewApi && window.google.maps.places.PlaceAutocompleteElement) {
        // Clean up any existing autocomplete element
        if (autocompleteElementRef.current && containerRef.current) {
          const existingElement = containerRef.current.querySelector('gmp-place-autocomplete');
          if (existingElement) {
            existingElement.remove();
          }
        }

        try {
          // Create the new PlaceAutocompleteElement
          const autocompleteElement = new google.maps.places.PlaceAutocompleteElement({
            componentRestrictions: { country: 'ro' },
          });

          autocompleteElement.id = 'place-autocomplete';
          
          // Style the element to match our design
          autocompleteElement.style.cssText = `
            width: 100%;
            --gmpx-color-surface: hsl(var(--background));
            --gmpx-color-on-surface: hsl(var(--foreground));
            --gmpx-color-on-surface-variant: hsl(var(--muted-foreground));
            --gmpx-color-primary: hsl(var(--primary));
          `;

          autocompleteElement.addEventListener('gmp-placeselect', (event: any) => {
            const place = event.place;
            if (place?.displayName) {
              setLocalValue(place.displayName);
              onChange(place.displayName);
            } else if (place?.formattedAddress) {
              setLocalValue(place.formattedAddress);
              onChange(place.formattedAddress);
            }
          });

          if (containerRef.current) {
            const wrapper = containerRef.current.querySelector('.autocomplete-wrapper');
            if (wrapper) {
              wrapper.innerHTML = '';
              wrapper.appendChild(autocompleteElement);
            }
          }

          autocompleteElementRef.current = autocompleteElement;
        } catch (error) {
          console.warn('PlaceAutocompleteElement not available, falling back to Autocomplete');
          setUseNewApi(false);
        }

        return () => {
          if (containerRef.current) {
            const existingElement = containerRef.current.querySelector('gmp-place-autocomplete');
            if (existingElement) {
              existingElement.remove();
            }
          }
        };
      } else if (!useNewApi && inputRef.current) {
        // Fallback to legacy Autocomplete API
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

        return () => {
          google.maps.event.clearInstanceListeners(autocomplete);
        };
      }
    }, [isGoogleLoaded, onChange, useNewApi]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
      onChange(e.target.value);
    };

    return (
      <div ref={containerRef} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          {useNewApi && isGoogleLoaded ? (
            <div className="autocomplete-wrapper pl-10 [&_gmp-place-autocomplete]:w-full [&_gmp-place-autocomplete_input]:w-full [&_gmp-place-autocomplete_input]:h-10 [&_gmp-place-autocomplete_input]:px-3 [&_gmp-place-autocomplete_input]:py-2 [&_gmp-place-autocomplete_input]:rounded-md [&_gmp-place-autocomplete_input]:border [&_gmp-place-autocomplete_input]:border-input [&_gmp-place-autocomplete_input]:bg-background [&_gmp-place-autocomplete_input]:text-sm [&_gmp-place-autocomplete_input]:ring-offset-background [&_gmp-place-autocomplete_input]:focus-visible:outline-none [&_gmp-place-autocomplete_input]:focus-visible:ring-2 [&_gmp-place-autocomplete_input]:focus-visible:ring-ring" />
          ) : (
            <Input
              ref={inputRef}
              value={localValue}
              onChange={handleChange}
              placeholder={placeholder}
              className="pl-10 bg-background border-input focus:ring-2 focus:ring-primary/20"
            />
          )}
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
);
