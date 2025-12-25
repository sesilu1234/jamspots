type StaticMapProps = {
  address?: string;
  lat?: number;
  lng?: number;
  fallbackLat: number;
  fallbackLng: number;
  apiKey: string;
};

export default function StaticMap({
  address,
  fallbackLat,
  fallbackLng,
  apiKey,
}: StaticMapProps) {
  const hasAddress = address && address.trim().length > 0;

  const center = hasAddress
    ? encodeURIComponent(address!)
    : `${fallbackLat},${fallbackLng}`;

  // marker → usa address o fallback también
  const markerLocation = hasAddress
    ? encodeURIComponent(address!)
    : `${fallbackLat},${fallbackLng}`;

  const marker = `&markers=color:red%7Clabel:M%7C${markerLocation}`;

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=16&size=600x400&maptype=roadmap&scale=2${marker}&key=${apiKey}`;

  const googleMapsUrl = hasAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address!,
      )}`
    : `https://www.google.com/maps/search/?api=1&query=${fallbackLat},${fallbackLng}`;

  return (
    <div className="pl-0 w-1/2">
      <img
        src={mapUrl}
        alt="Static Map"
        className="border border-gray-800 rounded-lg cursor-pointer"
        onClick={() => window.open(googleMapsUrl, '_blank')}
      />
    </div>
  );
}
