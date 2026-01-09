'use client';
import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Image from 'next/image';
import Link from 'next/link';
import { useMapContext } from './MapContext';
import { Card, CardContent } from '@/components/ui/card';

type Marker = {
  id: string;
  lat: number;
  lng: number;
};

type JamCardMarkerProps = {
  slug: string;
  images?: string;
  jam_title: string;
  location_title: string;
  location_address: string;
  time: string;
  styles?: string[];
};

import { Skeleton } from '@/components/ui/skeleton';

export default function MapMarkersCluster() {
  const map = useMap();

  const { markersData, setMarkersData } = useMapContext();

  // const [markersDetails, setMarkersDetails] = useState<Record<number, MarkerDetail>>({});
  const [selectedMarker, setSelectedMarker] =
    useState<JamCardMarkerProps | null>(null);

  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

  async function fetchMarker(id: string) {
    try {
      setShowSkeleton(true); // force skeleton visible immediately

      const res = await fetch(`/api/public/get-jam-by-id/${id}`);
      const markerDetail: JamCardMarkerProps = await res.json();

      setSelectedMarker(markerDetail);
      setShowSkeleton(false);
    } catch (err) {
      console.error('Failed to fetch marker details:', err);
      setShowSkeleton(false);
    }
  }

  const onClickMarker = async (id: string) => {
    setSelectedMarker(null);

    setShowSkeleton(true);

    await fetchMarker(id);
  };

  useEffect(() => {
    if (!map || markersData.length === 0) return;

    // @ts-expect-error makerExists
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
      <div className="absolute top-4 right-4  z-[401] border border-gray-200">
        <div className=" absolute flex justify-end items-center top-[-15] right-[-15] z-5">
          <button
            onClick={() => {
              setSelectedMarker(null);
              setShowSkeleton(false);
            }}
            className="text-gray-500 hover:text-gray-800 text-3xl font-extralight flex items-center justify-center    w-8 h-8 bg-black rounded-4xl text-white hover:text-black hover:bg-gray-100 transition"
          >
            ×
          </button>
        </div>

        <JamCardMarker jamData={selectedMarker} classname={'cursor-pointer'} />
      </div>
    );

  if (showSkeleton) return <CardSkeleton />; // nothing to show

  return null;
}

export function JamCardMarker({
  jamData,
  classname,
}: {
  jamData: JamCardMarkerProps;
  classname?: string;
}) {
  return (
    <Card
      className={`flex flex-col p-2    w-82   border-1 border-black/30  ${classname}`}
    >
      <Link href={`/jam/${jamData.slug}`} prefetch={false}>
        {/* Image left (desktop) / top (mobile) */}
        <div className="relative   h-64">
          {jamData.images && (
            <Image
              src={jamData.images}
              alt={`${jamData.jam_title} at ${jamData.location_title}`}
              fill
              className="object-cover"
            />
          )}
        </div>
        <CardContent className="flex flex-col gap-2 justify-between text-xs mt-3 mb-1  ">
          <div className="font-bold text-lg text-black line-clamp-2 leading-tight">
            {jamData.jam_title} at {jamData.location_title}
          </div>

          <div className="text-xs text-gray-500">
            {jamData.location_address}
          </div>
          <div className="text-sm text-gray-500">{jamData.time}</div>
          {jamData.styles && (
            <div className="flex flex-wrap gap-1">
              {jamData.styles.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-200 rounded px-2 py-1 text-xs text-black"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

const tags = ['blues', 'rap'];

export function CardSkeleton() {
  return (
    <Card
      className={`flex flex-col p-4 w-70  shadow-md absolute  top-4 right-4 z-[401]   `}
    >
      {/* Image left (desktop) / top (mobile) */}
      <div className="relative ">
        <Skeleton className="h-48" />
      </div>

      {/* Right panel */}
      <CardContent className="flex flex-col justify-between text-xs ">
        <div className="flex flex-col gap-2 font-bold text-lg pt-4">
          <Skeleton className="h-4" />
          <Skeleton className="h-4 w-3/5 " />
        </div>

        <div className="flex flex-col gap-2 text-xs text-gray-500 pt-4">
          <Skeleton className="h-4 w-3/5 " />
        </div>

        {tags && (
          <div className="flex flex-wrap gap-1 pt-8">
            {[1, 2, 3].map((tag, i) => (
              <span key={i} className="bg-gray-200 rounded px-0 py-0 text-xs">
                <Skeleton className="w-12 h-6   " />
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
