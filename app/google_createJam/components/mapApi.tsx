"use client";

import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapControl,
  useMapsLibrary,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { useMapContext } from "./mapContext";
import type { LocationData } from "./mapContext"; // adjust path as needed

const API_KEY = "AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE";

// type Poi = { key: string; location: google.maps.LatLngLiteral };

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export default function MapRender() {
  const { map, setLocation } = useMapContext();

  const [markerPos, setMarkerPos] = useState({
    lat: -33.8567844,
    lng: 151.213108,
  });

  useEffect(() => {
    // setLocations(initialLocations);
  }, []);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map mapId="da37f3254c6a6d1c" defaultZoom={13} defaultCenter={markerPos}>
        <MapProviderInside />

        {/* Example marker */}
        <MarkerLocation position={markerPos} />

        <MapControl position={ControlPosition.TOP}>
          <div className="w-72 m-6">
            <PlaceAutocomplete
              onPlaceSelect={(place) => {
                if (!place) {
                  setLocation(null);
                  return;
                }

                const data: LocationData = {
                  name: place.name || "",
                  address: place.formatted_address || "",
                  coordinates: {
                    lat: place.geometry!.location!.lat(),
                    lng: place.geometry!.location!.lng(),
                  },
                };

                setLocation(data);
                setMarkerPos(data.coordinates);
                if (map) {
                  map.panTo(data.coordinates);
                  map.setZoom(14); // set your desired zoom
                }
              }}
            />
          </div>
        </MapControl>
      </Map>
    </APIProvider>
  );
}

function MapProviderInside() {
  const { setMap } = useMapContext();
  const map = useMap();

  useEffect(() => {
    if (map) setMap(map);
  }, [map]);

  return null;
}

function MarkerLocation({ position }: { position: google.maps.LatLngLiteral }) {
  const { setLocation } = useMapContext();

  return (
    <AdvancedMarker
      position={position}
      draggable
      onDragEnd={(event) => {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();

        if (lat && lng) {
          console.log("New position:", { lat, lng });
          setLocation({
            name: "",
            address: "",
            coordinates: {
              lat,
              lng,
            },
          });
        }
      }}
    />
  );
}

function PlaceAutocomplete({ onPlaceSelect }: PlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "name", "formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      console.log("eii");
      console.log(autocomplete.getPlace());

      onPlaceSelect(autocomplete.getPlace() || null);
    });

    return () => google.maps.event.clearInstanceListeners(autocomplete);
  }, [places]);

  return (
    <input
      ref={inputRef}
      placeholder="Search a place..."
      className="w-full h-10 px-3 text-lg bg-white border border-gray-800 rounded"
    />
  );
}
