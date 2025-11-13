import { useMapContext } from './mapContext';

export default function Button({ className }: { className?: string }) {
  const { map, locations, setLocations } = useMapContext();
  const handleShift = () => {
    const newLocs = locations.map((poi) => ({
      ...poi,
      location: {
        lat: poi.location.lat - 0.2,
        lng: poi.location.lng - 0.2,
      },
    }));
    setLocations(newLocs);

    if (!map) return;
    const bounds = new google.maps.LatLngBounds();
    newLocs.forEach((poi) => bounds.extend(poi.location));
    map.fitBounds(bounds, { top: 200, right: 200, bottom: 200, left: 200 });
  };

  return (
    <button
      onClick={handleShift}
      className={`bg-yellow-400 text-black px-3 py-1 rounded-lg shadow ${className}`}
    >
      Accept and Send
    </button>
  );
}
