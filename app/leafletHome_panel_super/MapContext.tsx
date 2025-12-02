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

  const setPosition = (lat: number, lng: number) => {
    setLocationSearch({ coordinates: { lat, lng } });
    if (map) {
      map.flyTo([lat, lng], 10, { duration: 1.5 });
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition(latitude, longitude);
        },
        () => setPosition(-33.8688, 151.2093), // fallback → Sydney
      );
    } else {
      setPosition(-33.8688, 151.2093);
    }
  }, [map]);

  return (
    <MapContext.Provider
      value={{ map, setMap, locationSearch, setLocationSearch }}
    >
      {children}
    </MapContext.Provider>
  );
};
