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
   currentUsedPath: string;
}

type Marker = {
  id: string;
  lat: number;
  lng: number;
};

import { JamCard } from '@/types/jam';
import { usePathname } from 'next/navigation'

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
  currentUsedPath
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
  const pathname = usePathname()?.substring(1) || '' // "home/about"

  useEffect(() => {
  if (!map) return; // wait for map


  try {
    

    console.log(currentUsedPath, 'current');
    console.log(pathname, 'pathname');

    if (pathname !== currentUsedPath) {
      // Fetch coordinates from internal API
      fetch(`/api/public/geocoding?address=${encodeURIComponent(pathname)}`)
        .then(res => res.json())
        .then(parsed => {
          if (!parsed || !parsed[0]) return

          console.log(parsed);

          const firstResult = parsed[0]
          const { formatted_address: city, geometry } = firstResult

          setGoogleSearchLocation(city || '')
          setLocationSearch({
            coordinates: {
              lat: geometry.location.lat,
              lng: geometry.location.lng,
            },
          })

          map.flyTo([geometry.location.lat, geometry.location.lng], 11, {
            duration: 1.5,
          })
        })
        

      return // done
    }
  } catch {
    // ignore malformed state
  }

  // fallback: initial user location
  if (initialUserLocation) {
    map.flyTo(
      [initialUserLocation.latitude, initialUserLocation.longitude],
      11,
      { duration: 1.5 }
    )
    const cookieData = { city: initialUserLocation.city || '', latitude: initialUserLocation.latitude, longitude: initialUserLocation.longitude, timestamp: Date.now() };
    document.cookie = `user_location=${encodeURIComponent(JSON.stringify(cookieData))}; path=/; max-age=14400; SameSite=Lax`;
  }
}, [map])


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
