"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type LocationSearch = {
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number;
};

type MapContextType = {
  map: google.maps.Map | null;
  setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
  locationSearch: LocationSearch | null;
  setLocationSearch: React.Dispatch<
    React.SetStateAction<LocationSearch | null>
  >;
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapContext must be used within MapProvider");
  return ctx;
};

type MapProviderProps = { children: ReactNode };

export const MapProvider = ({ children }: MapProviderProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [locationSearch, setLocationSearch] = useState<LocationSearch | null>(
    null
  );

  return (
    <MapContext.Provider
      value={{ map, setMap, locationSearch, setLocationSearch }}
    >
      {children}
    </MapContext.Provider>
  );
};
