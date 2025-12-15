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
      map.flyTo([lat, lng], 3, { duration: 1.5 });
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition(-33.8688, 151.2093); // fallback → Sydney
      setInitialLocation({
        latitude: -33.8688,
        longitude: 151.2093,
        city: 'Sidney',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setPosition(latitude, longitude);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        )
          .then((res) => res.json())
          .then((data) => {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.county ||
              data.address.state;

            setInitialLocation({ latitude, longitude, city });
          })
          .catch((err) => console.error(err));
      },
      () => {
        setInitialLocation({
          latitude: -33.815,
          longitude: 151.001,
          city: 'Parramatta Nueva Gales del Sur, Australia',
        });
        setPosition(-33.815, 151.001);
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
