// app/components/MapApp.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

const API_KEY = "AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE";

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

export default function MapApp() {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Map
        defaultZoom={8}
        defaultCenter={{ lat: 43.54992, lng: -116 }}
        gestureHandling="greedy"
        disableDefaultUI
      >
        {selectedPlace?.geometry?.location && (
          <AdvancedMarker
            ref={markerRef}
            position={selectedPlace.geometry.location}
          />
        )}
      </Map>

      <MapControl position={ControlPosition.TOP}>
        <div className="w-72 m-6">
          <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
        </div>
      </MapControl>

      <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
}

const MapHandler = ({ place, marker }: MapHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) map.fitBounds(place.geometry.viewport);
    else if (place.geometry?.location) map.panTo(place.geometry.location);

    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const auto = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "name", "formatted_address"],
    });

    auto.addListener("place_changed", () =>
      onPlaceSelect(auto.getPlace() || null)
    );

    setAutocomplete(auto);

    return () => google.maps.event.clearInstanceListeners(auto);
  }, [places, onPlaceSelect]);

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
