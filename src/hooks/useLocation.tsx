import { useState, useEffect, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface UseLocationReturn {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => Promise<void>;
  hasPermission: boolean;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // ANTEGRAVITY: Implementar geolocalização
  // - Usar navigator.geolocation API
  // - Implementar fallback com IP geolocation
  // - Cache de localização para evitar chamadas repetidas
  // - LGPD: Solicitar consentimento explícito para uso de localização

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      setIsLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // 1 minuto de cache
        });
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setHasPermission(true);
    } catch (err) {
      const error = err as GeolocationPositionError;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError('Permissão de localização negada. Por favor, habilite nas configurações do navegador.');
          break;
        case error.POSITION_UNAVAILABLE:
          setError('Localização indisponível no momento.');
          break;
        case error.TIMEOUT:
          setError('Tempo esgotado ao obter localização.');
          break;
        default:
          setError('Erro ao obter localização.');
      }
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tentar obter localização automaticamente na primeira renderização
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    error,
    isLoading,
    requestLocation,
    hasPermission,
  };
}

// Função auxiliar para calcular distância entre duas coordenadas (Haversine)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
