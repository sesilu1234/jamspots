// app/components/MapApp.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY = 'AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export default function MapApp() {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

  return (
    <APIProvider apiKey={API_KEY}>
      <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
    </APIProvider>
  );
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const auto = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
    });

    auto.addListener('place_changed', () => onPlaceSelect(auto.getPlace() || null));

    setAutocomplete(auto);

    return () => google.maps.event.clearInstanceListeners(auto);
  }, [places]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        placeholder="Search a place..."
        className="w-full h-10 px-3 text-lg box-border bg-white border border-gray-800 rounded"
      />
      <ul className="absolute w-full bg-white border border-gray-300 mt-1 list-none p-0 m-0 max-h-60 overflow-y-auto z-10">
        {suggestions.map((item, index) => (
          <li
            key={index}
            className="px-2 py-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              // If you want click to select, you'd call onPlaceSelect here
            }}
          >
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
};
