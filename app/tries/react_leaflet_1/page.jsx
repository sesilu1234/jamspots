// page.tsx
"use client";
import React from "react";
import { MapProvider } from "./mapContext";
import MapRender from "./mapApi";
import Button from "./button";

export default function Home() {
  return (
    <MapProvider>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="flex items-center justify-center gap-16">
          <Button city="Madrid" className="my-15" />

          <Button city="Gandia" className="my-15" />
        </div>
        <div className="w-[1100px] h-90 max-w-8/10  mt-4">
          <MapRender />
        </div>
      </div>
    </MapProvider>
  );
}
