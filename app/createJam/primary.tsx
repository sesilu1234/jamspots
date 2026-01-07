'use client';

type PrimaryProps = {
  jamTitleRef: React.RefObject<string>;
  locationTitleRef: React.RefObject<string>;
  locationAddressRef: React.RefObject<string>;
  coordinatesRef: React.RefObject<{ lat: string | null; lng: string | null }>;
};

import { useState, useEffect } from 'react';
import Image from 'next/image';
export default function Primary({
  jamTitleRef,
  locationTitleRef,
  locationAddressRef,
  coordinatesRef,
}: PrimaryProps) {
  {
    const [dataLocation, setdataLocation] = useState({
      jam_name: jamTitleRef.current,
      location_name: locationTitleRef.current,
      address: locationAddressRef.current,
      coordinates: coordinatesRef.current,
    });

    jamTitleRef.current = dataLocation.jam_name;
    locationTitleRef.current = dataLocation.location_name;
    locationAddressRef.current = dataLocation.address;
    coordinatesRef.current = dataLocation.coordinates;

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
        setdataLocation((prev) => ({
          jam_name: prev.jam_name || `Jam de ${event.data.name}`,
          location_name: prev.location_name || `${event.data.name}`,
          address: event.data.address,
          coordinates: event.data.coordinates,
        }));
      };

      return () => channel.close();
    }, []);

    const openPopup = () => {
      window.open(
        '/createJam/selectOnMap',
        'createJam',
        'width=400,height=300',
      );
    };

    return (
      <div className="p-4 mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="block font-semibold mb-1 ml-2">Jam Name</label>
              <input
                className="border p-2 w-full"
                value={dataLocation.jam_name}
                placeholder="No jam name yet"
                onChange={(e) =>
                  setdataLocation((prev) => ({
                    ...prev,
                    jam_name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block font-semibold mb-1 ml-2">
                Location Name
              </label>
              <input
                className="border p-2 w-full"
                value={dataLocation.location_name}
                placeholder="No location name yet"
                onChange={(e) =>
                  setdataLocation((prev) => ({
                    ...prev,
                    location_name: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="block font-semibold mb-1 ml-2"> Address</label>
              <div
                className="border p-2 w-full"
                
                onChange={(e) =>
                  setdataLocation((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              >
                {dataLocation.address ? (
                  <span>{dataLocation.address}</span>
                ) : (
                  <span className="py-2 text-md text-gray-500/85 select-none">
                    Click on the map to set the address
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-center  p-2 w-full cursor-pointer">
              <Image
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=400x200&scale=2${marker}&style=feature:poi|element:labels|visibility:off&key=AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE`}
                alt="Mapa"
                width={400}
                height={200}
                className={`object-cover rounded ${hasCoords ? '' : 'animate-glow-ring-strong'} cursor-pointer`}
                onClick={openPopup}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
