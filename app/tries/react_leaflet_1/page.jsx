// page.tsx
"use client";
import React from "react";
import { MapProvider } from "./MapContext";

import PlacesSearch from "./places_api_search";
import dynamic from "next/dynamic";

const MapRender = dynamic(() => import("./MapPlain"), { ssr: false });


export default function Home() {
  return (
    <MapProvider>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="flex items-center justify-center">
          <PlacesSearch />

         
        </div>
        <div className="w-[1100px] h-90 max-w-8/10  mt-20">
          <MapRender />
        </div>
      </div>
    </MapProvider>
  );
}
