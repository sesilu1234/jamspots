// page.tsx
'use client';
import React from 'react';
import { MapProvider } from './MapContext';

import PlacesSearch from './places_api_search';
import dynamic from 'next/dynamic';

const MapRender = dynamic(() => import('./MapPlain'), { ssr: false });

export default function Home() {
  return (
    <MapProvider>
      <div className="flex flex-col items-center justify-center w-full h-screen gap-12">
        <PlacesSearch />

        <div className="w-[900px] max-w-[80%] h-[360px] mx-auto rounded-xl overflow-visible bg-gray-100 shadow-2xl">
          <MapRender />
        </div>
      </div>
    </MapProvider>
  );
}
