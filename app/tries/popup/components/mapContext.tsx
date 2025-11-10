// MapContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Location = {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
};

type MapContextType = {
  map: google.maps.Map | null;
  setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
  location: Location | null;
  setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
};

const MapContext = createContext<MapContextType | null>(null);

export const useMapContext = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapContext must be used within MapProvider");
  return ctx;
};

type MapProviderProps = { children: ReactNode };

export const MapProvider = ({ children }: MapProviderProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  return (
    <MapContext.Provider value={{ map, setMap, location, setLocation }}>
      {children}
    </MapContext.Provider>
  );
};
