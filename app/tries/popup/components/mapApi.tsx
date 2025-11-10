// Diff.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMapContext } from "./mapContext";

type Poi = { key: string; location: google.maps.LatLngLiteral };

const initialLocations: Poi[] = [
  { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
];

export default function MapRender() {
  const { location, setLocation } = useMapContext();

  useEffect(() => {
    setLocation(initialLocations);
  }, []);

  return (
    <APIProvider apiKey="AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE">
      <Map
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
      >
        <MapProviderInside />
        <PoiMarkers pois={location} />
      </Map>
    </APIProvider>
  );
}

// MapProviderInside initializes map context safely inside the Map
function MapProviderInside() {
  const { setMap } = useMapContext();
  const map = useMap();

  useEffect(() => {
    if (!map) return; // only set when map is ready
    setMap(map);
  }, []);

  return null;
}

function PoiMarkers({ pois }: { pois: Poi[] }) {
  const { map } = useMapContext();
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) {
      console.log("Map not ready yet");
      return;
    }

    const markers = pois.map(
      (poi) =>
        new google.maps.Marker({
          position: poi.location,
          title: poi.key,
        })
    );

    clustererRef.current = new MarkerClusterer({ map, markers });

    return () => clustererRef.current?.clearMarkers();
  }, [map, pois]);

  return null;
}
