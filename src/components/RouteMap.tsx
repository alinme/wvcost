/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from 'react';
import { Departure } from '@/types/route';
import { Map, AlertCircle } from 'lucide-react';

interface RouteMapProps {
  departure: Departure;
  isGoogleLoaded: boolean;
}

export function RouteMap({ departure, isGoogleLoaded }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasRoute = departure.distance !== null && departure.startAddress.value && departure.returnAddress.value;

  useEffect(() => {
    if (!isGoogleLoaded || !mapRef.current || !hasRoute) {
      return;
    }

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: 45.9432, lng: 24.9668 }, // Romania center
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: mapInstanceRef.current,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: 'hsl(var(--primary))',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });
    }

    // Calculate and display route
    const directionsService = new google.maps.DirectionsService();

    const waypoints = departure.intermediateStops
      .filter(s => s.value.trim())
      .map(s => ({
        location: s.value,
        stopover: true,
      }));

    directionsService.route(
      {
        origin: departure.startAddress.value,
        destination: departure.returnAddress.value,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result && directionsRendererRef.current) {
          directionsRendererRef.current.setDirections(result);
          setError(null);
        } else {
          setError('Nu s-a putut afișa ruta pe hartă');
        }
      }
    );
  }, [isGoogleLoaded, hasRoute, departure.startAddress.value, departure.returnAddress.value, departure.intermediateStops]);

  if (!hasRoute) {
    return (
      <div className="rounded-lg bg-muted/30 border border-dashed border-border p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
        <Map className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Calculați ruta pentru a vedea previzualizarea pe hartă
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Map className="h-4 w-4" />
        Previzualizare hartă
      </div>
      {error ? (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : (
        <div
          ref={mapRef}
          className="w-full h-[250px] rounded-lg border border-border overflow-hidden"
        />
      )}
    </div>
  );
}
