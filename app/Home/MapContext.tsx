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


export type InitialLocation = {
  city: string;
  latitude: number;
  longitude: number;
};


type MapContextType = {
  map: LeafletMap | null;
  setMap: React.Dispatch<React.SetStateAction<LeafletMap | null>>;
  locationSearch: LocationSearch | null;
  initialLocation: InitialLocation | null;
  setInitialLocation:  React.Dispatch<
    React.SetStateAction<InitialLocation>
  >;
  setLocationSearch: React.Dispatch<
    React.SetStateAction<LocationSearch | null>
  >;
  markersData:Marker[] ; 
        setMarkersData: React.Dispatch<
    React.SetStateAction<Marker[]>
  >;
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



export const MapProvider = ({ children, initialUserLocation, resCards }: MapProviderProps) => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [locationSearch, setLocationSearch] = useState<LocationSearch | null>({
    coordinates: { 
      lat: initialUserLocation.latitude, 
      lng: initialUserLocation.longitude 
    }
  });
  const [initialLocation, setInitialLocation] = useState(initialUserLocation);

  const [markersData, setMarkersData] = useState<Marker[]>(resCards?.map((jam: JamCard) => ({
            id: jam.id,
            lat: jam.lat,
            lng: jam.lng,
          })));

  // const setPosition = (lat: number, lng: number) => {
  //   setLocationSearch({ coordinates: { lat, lng } });
  //   if (map) {
  //     map.flyTo([lat, lng], 11, { duration: 1.5 });
  //   }
  // };


  useEffect(() => {
    if (map && initialUserLocation) {
      map.flyTo([initialUserLocation.latitude, initialUserLocation.longitude], 11,  { duration: 1.5 });
    }
  }, [map]); // Only runs when the map engine is ready
  const CACHE_KEY = 'user_location';
  const CACHE_TTL = 8 * 60 * 60 * 1000; // 8h


  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        locationSearch,
        setLocationSearch,
        initialLocation,
        setInitialLocation,
        markersData,
        setMarkersData,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
