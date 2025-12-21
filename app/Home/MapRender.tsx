// components/MapComponent.tsx
'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { useMapContext } from './MapContext';
import MapMarkersCluster from './MarkerCluster';

import MapTileSwitcher from './MapTileSwitcher';

// Fix default marker icons in TypeScript
const DefaultIcon = L.icon({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function SetMap() {
  const { setMap } = useMapContext();

  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, []);
  return null;
}

export default function MapComponent() {
  return (
    <MapContainer
      center={[40.4168, -3.7038]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
    >
      <SetMap />

      <MapTileSwitcher selectedIndex={-2} />

      <MapMarkersCluster />
    </MapContainer>
  );
}
