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
  const [selectedMarker, setSelectedMarker] = useState<MarkerDetail | null>(
    null,
  );

  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

  const cardId = useRef<number | null>(null);

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

  // Fetch markers positions
  useEffect(() => {
    fetch('/api/get-all-markers')
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

  if (selectedMarker)
    return (
      <div className="absolute top-4 right-4 bg-white p-4 shadow-lg rounded-xl flex flex-col gap-3 w-48 z-[401] border border-gray-200">
        <div className="flex justify-between items-center py-1 h-1">
          <h3 className="font-semibold text-gray-900 truncate">{'Image'}</h3>
          <button
            onClick={() => {
              setSelectedMarker(null);
              setShowSkeleton(false);
            }}
            className="text-gray-500 hover:text-gray-800 text-sm font-bold"
          >
            ×
          </button>
        </div>

        <div className="relative w-full h-30 overflow-hidden rounded-lg">
          <Image
            src={selectedMarker.image}
            alt={'Image'}
            fill
            className="object-cover"
          />
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



export function CardSkeleton_1() {
  return (
    <div className="flex flex-col space-y-3  w-64     absolute top-4 right-4 bg-white p-4 shadow-lg rounded-xl z-[401] border border-gray-200 ">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const tags = ['blues', 'rap'];

export function CardSkeleton() {
  return (
      <Card className={`flex flex-col p-4    w-84  shadow-md absolute  top-4 right-4 z-[401]   `}>
     
        {/* Image left (desktop) / top (mobile) */}
        <div className="relative   h-54">
         <Skeleton className="h-full" />
        </div>

        {/* Right panel */}
        <CardContent className="flex flex-col justify-between text-xs ">
          <div className="flex flex-col gap-2 font-bold text-lg pt-4">
            <Skeleton className="h-4" />
        <Skeleton className="h-4 w-3/5 " />
          </div>

          <div className="flex flex-col gap-2 text-xs text-gray-500 pt-4"><Skeleton className="h-4" /><Skeleton className="h-4 w-3/5 " /></div>
         
          {tags && (
            <div className="flex flex-wrap gap-1 pt-12">
              {tags.map((tag, i) => (
                <span key={i} className="bg-gray-200 rounded px-2 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      
    </Card>
  );
}




