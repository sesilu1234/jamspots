// page.tsx
'use client';
import React from 'react';
import { MapProvider } from './MapContext';

import dynamic from 'next/dynamic';
import GooglePlacesSearch from './GooglePlacesSearch'



const MapRender = dynamic(() => import('./MapRender'), { ssr: false });

export default function Home() {
  return (
    <MapProvider>
      <div className="flex flex-col items-center justify-center w-full h-screen gap-6">
        
        <div className="w-[900px] max-w-[80%] mx-auto ">
         

         <div className='w-48' >
          <GooglePlacesSearch/>
          </div>
        </div>

        <div className="w-[900px] max-w-[80%] h-[360px] mx-auto rounded-xl overflow-visible bg-gray-100 shadow-2xl">
          <MapRender />
        </div>
      </div>
    </MapProvider>
  );
}
