// page.tsx
'use client';
import React from 'react';
import { MapProvider } from './MapContext';

import dynamic from 'next/dynamic';
import GooglePlacesSearch from './GooglePlacesSearch';
import JamCarousel from './jamsCarousel';

const MapRender = dynamic(() => import('./MapRender'), { ssr: false });

export default function Home() {
  return (
    <MapProvider>
      <div className="flex flex-col w-[1300px] max-w-[90%] mx-auto p-6 ">
        <div className="w-48 my-4">
          <GooglePlacesSearch />
        </div>

        <div className="relative w-full   mx-auto mt-12 h-148">
          <MapRender />
          <JamCarousel />
        </div>
      </div>
    </MapProvider>
  );
}
