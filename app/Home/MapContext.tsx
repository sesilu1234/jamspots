'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Map as LeafletMap } from 'leaflet';

export type LocationSearch = {
  coordinates: { lat: number; lng: number };
};

type MapContextType = {
  map: LeafletMap | null;
  setMap: React.Dispatch<React.SetStateAction<LeafletMap | null>>;
  locationSearch: LocationSearch | null;
  setLocationSearch: React.Dispatch<
    React.SetStateAction<LocationSearch | null>
  >;
};

type Marker = {
  id: string;
  lat: number;
  lng: number;
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapContext must be used within MapProvider');
  return ctx;
};

type MapProviderProps = { children: ReactNode };

export const MapProvider = ({ children }: MapProviderProps) => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [locationSearch, setLocationSearch] = useState<LocationSearch | null>(
    null,
  );

  const [initialLocation, setInitialLocation] = useState(null);

  const [markersData, setMarkersData] = useState<Marker[]>([]);

  const setPosition = (lat: number, lng: number) => {
    setLocationSearch({ coordinates: { lat, lng } });
    if (map) {
      map.flyTo([lat, lng], 11, { duration: 1.5 });
    }
  };

  const CACHE_KEY = 'user_location';
  const CACHE_TTL = 8 * 60 * 60 * 1000; // 8h

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        setPosition(parsed.latitude, parsed.longitude);
        setInitialLocation(parsed);
        return;
      }
    }

    if (!navigator.geolocation) {
      const fallback = {
        latitude: 40.4168,
        longitude: -3.7038,
        city: 'Madrid, Spain',
      };
      setPosition(fallback.latitude, fallback.longitude);
      setInitialLocation(fallback);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition(latitude, longitude);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();

          const baseCity =
            data.address.city ??
            data.address.town ??
            data.address.village ??
            data.address.state ??
            'Unknown';

          const city = data.address.country
            ? `${baseCity}, ${data.address.country}`
            : baseCity;

          const payload = {
            latitude,
            longitude,
            city,
            timestamp: Date.now(),
          };

          localStorage.setItem(CACHE_KEY, JSON.stringify(payload));

          setInitialLocation({ latitude, longitude, city });
        } catch {
          // keep coords even if reverse fails
          setInitialLocation({
            latitude,
            longitude,
            city: 'Unknown',
          });
        }
      },
      () => {
        const fallback = {
          latitude: 40.4168,
          longitude: -3.7038,
          city: 'Madrid, Spain',
        };
        setPosition(fallback.latitude, fallback.longitude);
        setInitialLocation(fallback);
      },
    );
  }, [map]);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        locationSearch,
        setLocationSearch,
        initialLocation,
        markersData,
        setMarkersData,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
