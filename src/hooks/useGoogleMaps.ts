/// <reference types="@types/google.maps" />
import { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

export function useGoogleMaps(apiKey: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setIsLoaded(false);
      setLoadError(null);
      return;
    }

    // Check if already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Remove existing script if any
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.remove();
    }

    window.initGoogleMaps = () => {
      setIsLoaded(true);
      setLoadError(null);
    };

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setLoadError('Eroare la încărcarea Google Maps. Verificați cheia API.');
      setIsLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('google-maps-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [apiKey]);

  const calculateRoute = useCallback(
    async (
      origin: string,
      destination: string,
      waypoints: string[]
    ): Promise<{ distance: number } | null> => {
      if (!isLoaded || !window.google?.maps) {
        return null;
      }

      return new Promise((resolve) => {
        const directionsService = new google.maps.DirectionsService();

        const waypointObjects = waypoints
          .filter(w => w.trim())
          .map(w => ({
            location: w,
            stopover: true,
          }));

        directionsService.route(
          {
            origin,
            destination,
            waypoints: waypointObjects,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: false,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              const totalDistance = result.routes[0].legs.reduce(
                (sum, leg) => sum + (leg.distance?.value || 0),
                0
              );
              resolve({ distance: totalDistance / 1000 }); // Convert to km
            } else {
              resolve(null);
            }
          }
        );
      });
    },
    [isLoaded]
  );

  return { isLoaded, loadError, calculateRoute };
}
