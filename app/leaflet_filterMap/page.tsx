// page.tsx
'use client';
import React from 'react';
import { MapProvider } from './components/mapContext';
import MapRender from './components/mapApi';
import Button from './components/button';

export default function Home() {
  return (
    <MapProvider>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <Button className="my-15" />
        <div className="w-[1100px] h-90 max-w-8/10  mt-4">
          <MapRender />
        </div>
      </div>
    </MapProvider>
  );
}
