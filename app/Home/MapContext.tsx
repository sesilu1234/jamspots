'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Map as LeafletMap } from 'leaflet';

import Cookies from 'js-cookie';
const FOUR_HOURS = 4 * 60 * 60 * 1000;

export type LocationSearch = {
  coordinates: { lat: number; lng: number };
};

export type SearchLocation = string;

type MapContextType = {
  map: LeafletMap | null;
  setMap: React.Dispatch<React.SetStateAction<LeafletMap | null>>;
  locationSearch: LocationSearch | null;
  googleSearchLocation: SearchLocation | null;
  setGoogleSearchLocation: React.Dispatch<React.SetStateAction<SearchLocation>>;
  setLocationSearch: React.Dispatch<
    React.SetStateAction<LocationSearch | null>
  >;
  markersData: Marker[];
  setMarkersData: React.Dispatch<React.SetStateAction<Marker[]>>;
};

interface MapProviderProps {
  children: React.ReactNode;
  initialUserLocation: {
    latitude: number;
    longitude: number;
    city: string;
  };
  resCards: JamCard[];
}

type Marker = {
  id: string;
  lat: number;
  lng: number;
};

import { JamCard } from '@/types/jam';

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapContext must be used within MapProvider');
  return ctx;
};

export const MapProvider = ({
  children,
  initialUserLocation,
  resCards,
}: MapProviderProps) => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [locationSearch, setLocationSearch] = useState<LocationSearch | null>({
    coordinates: {
      lat: initialUserLocation.latitude,
      lng: initialUserLocation.longitude,
    },
  });
  const [googleSearchLocation, setGoogleSearchLocation] = useState(
    initialUserLocation.city || '',
  );

  const [markersData, setMarkersData] = useState<Marker[]>(
    resCards?.map((jam: JamCard) => ({
      id: jam.id,
      lat: jam.lat,
      lng: jam.lng,
    })),
  );

  useEffect(() => {
    if (!map) return; // wait for map to be ready

    const raw = Cookies.get('user_location');

    try {
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw));

        // Only update if timestamp is fresh and location differs
        const isFresh = Date.now() - parsed.timestamp < FOUR_HOURS;
        const hasChanged =
          !initialUserLocation ||
          initialUserLocation.latitude !== parsed.latitude ||
          initialUserLocation.longitude !== parsed.longitude;

        if (isFresh && hasChanged) {
          const newLocation = {
            city: parsed.city,
            latitude: parsed.latitude,
            longitude: parsed.longitude,
          };

          setGoogleSearchLocation(parsed.city || '');

          setLocationSearch({
            coordinates: {
              lat: parsed.latitude,
              lng: parsed.longitude,
            },
          });

          map.flyTo([parsed.latitude, parsed.longitude], 11, { duration: 1.5 });
          return; // done
        }
      }
    } catch {
      // ignore malformed cookie
    }

    // fallback: fly to initial user location if cookie is missing or invalid
    if (initialUserLocation) {
      map.flyTo(
        [initialUserLocation.latitude, initialUserLocation.longitude],
        11,
        {
          duration: 1.5,
        },
      );
    }
  }, [map]);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        locationSearch,
        setLocationSearch,
        googleSearchLocation,
        setGoogleSearchLocation,
        markersData,
        setMarkersData,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
