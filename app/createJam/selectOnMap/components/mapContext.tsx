// MapContext.tsx
"use client";
import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	use,
	useEffect,
} from "react";

export type LocationData = {
	name: string;
	address: string;
	coordinates: google.maps.LatLngLiteral;
};

type MapContextType = {
	map: google.maps.Map | null;
	setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
	locationData: LocationData | null;
	setLocation: React.Dispatch<React.SetStateAction<LocationData | null>>;
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
	const [locationData, setLocation] = useState<LocationData | null>(null);

	useEffect(() => {
		console.log(locationData);
	}, [locationData]);

	return (
		<MapContext.Provider value={{ map, setMap, locationData, setLocation }}>
			{children}
		</MapContext.Provider>
	);
};
