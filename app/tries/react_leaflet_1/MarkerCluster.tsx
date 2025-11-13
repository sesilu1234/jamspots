'use client';
import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Image from 'next/image';

type Marker = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

type MarkerDetail = {
  id: number;
  description: string;
  image: string;
};

export default function MapMarkersCluster() {
  const map = useMap();

  const [markersData, setMarkersData] = useState<Marker[]>([]);
  // const [markersDetails, setMarkersDetails] = useState<Record<number, MarkerDetail>>({});
  const [selectedMarker, setSelectedMarker] = useState<MarkerDetail | null>(null);

  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

  const cardId = useRef<number | null>(null);

  // Fetch markers positions
  useEffect(() => {
    fetch('/markers.json')
      .then((res) => res.json())
      .then((data: Marker[]) => {
        setMarkersData(data); // update state
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!map || markersData.length === 0) return;

    // @ts-ignore
    const clusterGroup = L.markerClusterGroup();

    markersData.forEach((m) => {
      const marker = L.marker([m.lat, m.lng]);
      marker.on('click', () => onClickMarker(m.id));
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    // ✅ Cleanup function: remove the cluster from map
    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, markersData]);

  async function fetchMarker() {
    try {
      setShowSkeleton(true); // force skeleton visible immediately

      const res = await fetch('/markersDetails.json');
      const data: MarkerDetail[] = await res.json();

      const markerDetail = data.find((m) => m.id === cardId.current);
      if (markerDetail) {
        // preload image
        const img = new window.Image();
        img.src = markerDetail.image;

        img.onload = async () => {
          // ensure skeleton shows for at least 400ms
          await new Promise((r) => setTimeout(r, 400));

          setSelectedMarker(markerDetail);
          setShowSkeleton(false);
        };
      }
    } catch (err) {
      console.error('Failed to fetch marker details:', err);
      setShowSkeleton(false);
    }
  }

  const onClickMarker = async (id: number) => {
    console.log('00876sds');

    cardId.current = id;

    setSelectedMarker(null);

    setShowSkeleton(true);

    await fetchMarker();
  };

  if (selectedMarker)
    return (
      <div className="absolute top-4 right-4 bg-white p-4 shadow-lg rounded-xl flex flex-col gap-3 w-48 z-[401] border border-gray-200">
        <div className="flex justify-between items-center py-1 h-1">
          <h3 className="font-semibold text-gray-900 truncate">{'Image'}</h3>
          <button
            onClick={() => {
              setSelectedMarker(null);
              setShowSkeleton(true);
            }}
            className="text-gray-500 hover:text-gray-800 text-sm font-bold"
          >
            ×
          </button>
        </div>

        <div className="relative w-full h-30 overflow-hidden rounded-lg">
          <Image src={selectedMarker.image} alt={'Image'} fill className="object-cover" />
        </div>

        <p className="text-xs text-gray-700 leading-snug line-clamp-3 h-4">
          {selectedMarker.description}
        </p>
      </div>
    );

  if (showSkeleton) return <CardSkeleton />; // nothing to show

  return null;
}

import { Skeleton } from '@/components/ui/skeleton';

function CardSkeleton() {
  return (
    <div className="absolute top-4 right-4 bg-white p-4 shadow-lg rounded-xl flex flex-col gap-3 w-48 z-[401] border border-gray-200">
      <div className="flex justify-between items-center h-2">
        <Skeleton className="h-full w-3/4" />
      </div>

      <Skeleton className="h-30 w-full rounded-lg" />

      <div className="flex flex-col h-4">
        <Skeleton className="h-3/4 w-5/6" />
      </div>
    </div>
  );
}
