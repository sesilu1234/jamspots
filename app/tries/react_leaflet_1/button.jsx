import { useMapContext } from "./mapContext";
import { useState, useRef, useEffect } from "react";

export default function Button({ city, className }) {
  const handleSubmit = () => {};

  return (
    <div className="p-4">
      <button
        onClick={handleSubmit}
        className={`bg-yellow-400 text-black px-3 py-1 rounded-sm shadow ${className}`}
      >
        Filter to {city}
      </button>
    </div>
  );
}
