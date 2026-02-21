"use client";
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { Lock, Unlock } from "lucide-react"; 

export default function MapLockControl() {
  const map = useMap();
   const [isLocked, setIsLocked] = useState(() => {
    if (typeof window === "undefined") return false; // server-side
    return window.innerWidth < 768; // true on mobile
  });


  useEffect(() => {
    if (isLocked) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable(); // Mejor usar touchZoom para móviles
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
    }
  }, [isLocked, map]);

  return (
   <button
  onClick={() => setIsLocked(!isLocked)}
  className={`
    absolute bottom-8 right-4 z-[1000] 
    flex items-center gap-3 px-3 py-2 
    transition-all duration-500 ease-in-out
    
    /* The Glass Core */
    bg-stone-300/[0.5]  backdrop-saturate-150
    
    /* The "Glow" and Border */
    border border-black/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
    
    /* Hover effects */
    hover:bg-white/[0.15] hover:border-white/50 hover:scale-105
    active:scale-95 rounded-xl
  `}
>
  {/* Status Indicator with Glow */}
  <div className="relative flex items-center justify-center">
    <div className={`
      p-1.5 rounded-full transition-all duration-500
      ${isLocked 
        ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" 
        : "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"}
    `}>
      {isLocked ? (
        <Lock size={12} strokeWidth={3} className="text-white" />
      ) : (
        <Unlock size={12} strokeWidth={3} className="text-white" />
      )}
    </div>
    
    {/* Subtle pulse for Locked state */}
    {isLocked && (
      <span className="absolute inset-0 rounded-full bg-red-500 opacity-20"></span>
    )}
  </div>

  <div className="flex flex-col items-start leading-none">
    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-black/90 drop-shadow-sm">
      {isLocked ? "Map View" : "Active"}
    </span>
    <span className="text-[7px] font-medium uppercase tracking-widest text-black/50 mt-1">
      {isLocked ? "Locked" : "Explorer Mode"}
    </span>
  </div>
</button>
  );
}