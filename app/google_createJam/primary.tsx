'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Primary() {
  const [dataLocation, setdataLocation] = useState({
    name: '',
    address: '',
    coordinates: {
      lat: '',
      lng: '',
    },
  });

  const hasCoords =
    dataLocation?.coordinates?.lat && dataLocation?.coordinates?.lng;
  const center = hasCoords
    ? `${dataLocation.coordinates.lat},${dataLocation.coordinates.lng}`
    : '0,0';
  const zoom = hasCoords ? 15 : 2;
  const marker = hasCoords ? `&markers=color:red%7C${center}` : '';

  useEffect(() => {
    const channel = new BroadcastChannel('location_broadcast');
    channel.onmessage = (event) => {
      console.log(event.data);
      setdataLocation(event.data);
    };
    return () => channel.close();
  }, []);

  const openPopup = () => {
    window.open(
      '/google_createJam/google_selectOnMap',
      'google_createJam',
      'width=400,height=300',
    );
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="border p-2 w-full">
            {dataLocation.name
              ? `Jam de ${dataLocation.name}`
              : 'No jam name yet'}
          </div>

          <div className="border p-2 w-full">
            {dataLocation.name || 'No location name yet'}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border p-2 w-full">
            {dataLocation.address || 'No address selected yet'}
          </div>
          <div className="flex justify-center  p-2 w-full">
            <Image
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=400x200&scale=2${marker}&style=feature:poi|element:labels|visibility:off&key=AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE`}
              alt="Mapa"
              width={400}
              height={200}
              className="object-cover rounded"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <button
          className="border px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={openPopup}
        >
          Add Location
        </button>
      </div>
    </div>
  );
}
