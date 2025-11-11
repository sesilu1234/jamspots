// app/page.jsx
"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapPlain"), {
  ssr: false, // needed because Leaflet uses window
});

export default function Page() {
  const [locations, setLocations] = useState([
    { lat: 40.4168, lng: -3.7038, name: "Madrid" },
    { lat: 41.3851, lng: 2.1734, name: "Barcelona" },
  ]);

  const filterToMadrid = () => {
    setLocations([{ lat: 40.4168, lng: -3.7038, name: "Madrid" }]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">React-Leaflet Map</h1>

      <MapComponent locations={locations} />
    </div>
  );
}
