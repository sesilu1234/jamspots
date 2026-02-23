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
    
    /* Using a cleaner glass effect */
    bg-white/70 backdrop-blur-md 
    border border-black/10 shadow-lg
    
    hover:bg-white/90 hover:scale-105
    active:scale-95 rounded-xl
  `}
>
  {/* Status Indicator with Glow */}
  <div className="relative flex items-center justify-center">
    <div className={`
      p-1.5 rounded-full transition-all duration-500
      ${isLocked 
        ? "bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.5)]" 
        : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"}
    `}>
      {isLocked ? (
        <Lock size={12} strokeWidth={3} className="text-white" />
      ) : (
        <Unlock size={12} strokeWidth={3} className="text-white" />
      )}
    </div>
    
    {/* Subtle pulse for Locked state - now Indigo/Blue */}
    {isLocked && (
      <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500 opacity-20"></span>
    )}
  </div>

  <div className="flex flex-col items-start leading-none">
    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-800">
      {isLocked ? "Fixed View" : "Free View"}
    </span>
    <span className="text-[7px] font-bold uppercase tracking-widest text-slate-500 mt-1">
      {isLocked ? "Perspective Locked" : "Explorer Mode"}
    </span>
  </div>
</button>
  );
}