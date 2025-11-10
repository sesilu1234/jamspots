"use client";
import dynamic from "next/dynamic";

const MapApp = dynamic(() => import("./MapApp"), { ssr: false });

export default function Page() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapApp />
    </div>
  );
}
