'use client';
import { useState, useRef, useEffect } from 'react';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useMapContext } from './MapContext';

const API_KEY = 'AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export default function GooglePlacesSearch() {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <APIProvider apiKey={API_KEY}>
      <PlaceAutocomplete />
    </APIProvider>
  );
}

const PlaceAutocomplete = () => {
  const { initialLocation, setLocationSearch, map } = useMapContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setLocationSearch({ coordinates: { lat, lng } });
        if (map) {
          map.flyTo([lat, lng], 12, {
            duration: 1.5,
          });
        } else {
          console.log('no map');
        }
      } else {
        console.log('No location available for this place');
      }
    });

    return () => google.maps.event.clearInstanceListeners(autocomplete);
  }, [places, map]);

  return (
    <input
      ref={inputRef}
      placeholder={initialLocation?.city || ''}
      className="
    w-full h-12 px-3 text-sm
    bg-tone-4/60
    text-tone-1
    placeholder:text-tone-1/60
    border border-tone-3
    rounded
    focus:outline-none
    focus:ring-2 focus:ring-primary
    focus:border-primary
    mt-0
  "
    />
  );
};
