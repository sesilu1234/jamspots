"use client";
import { useMapContext } from "./MapContext";
import { useState, ChangeEvent } from "react";
import L from "leaflet";

export default function RadiusInput() {
  const { map } = useMapContext();
  const [radius, setRadius] = useState<number | "">("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setRadius(value);

    if (map && !isNaN(value)) {
      const center = map.getCenter();
      const circle = L.circle(center, { radius: value * 1000 });
      circle.addTo(map);
      map.fitBounds(circle.getBounds());
    }
  };

  return (
    <input
      type="number"
      value={radius}
      onChange={handleChange}
      placeholder="Radius (km)"
      className="border p-2 rounded"
    />
  );
}
