// page.tsx
'use client';
import React from 'react';
import { MapProvider } from './MapContext';

import dynamic from 'next/dynamic';
import GooglePlacesSearch from './GooglePlacesSearch';
import JamCardShadcn from './CardJam';

const MapRender = dynamic(() => import('./MapRender'), { ssr: false });

export default function Home() {
  return (
    <MapProvider>
      <div className="flex flex-col max-w-[90%]  mx-auto gap-6 p-6 ">
        <div className="w-[900px] mx-auto ">
          <div className="w-48">
            <GooglePlacesSearch />
          </div>
        </div>

        <div className=" max-w-[90%] h-144 mx-auto  flex gap-12 ">
          <div className="flex flex-col h-144 w-auto overflow-y-auto gap-12">
            <JamCardShadcn
              jamName={'Tonky Blues Jam'}
              spotName={'Moe Club'}
              tags={['Blues', 'Improvisation', 'Rock']}
              address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
              time={'Tuesday, Oct 21 - 12:00 PM'}
              src={'/images/sydney3.jpg'}
            />

            <JamCardShadcn
              jamName={'Tonky Blues Jam'}
              spotName={'Moe Club'}
              tags={['Blues', 'Improvisation', 'Rock']}
              address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
              time={'Tuesday, Oct 21 - 12:00 PM'}
              src={'/images/sydney3.jpg'}
            />

            <JamCardShadcn
              jamName={'Tonky Blues Jam'}
              spotName={'Moe Club'}
              tags={['Blues', 'Improvisation', 'Rock']}
              address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
              time={'Tuesday, Oct 21 - 12:00 PM'}
              src={'/images/sydney3.jpg'}
            />

            <JamCardShadcn
              jamName={'Tonky Blues Jam'}
              spotName={'Moe Club'}
              tags={['Blues', 'Improvisation', 'Rock']}
              address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
              time={'Tuesday, Oct 21 - 12:00 PM'}
              src={'/images/sydney3.jpg'}
            />

            <JamCardShadcn
              jamName={'Tonky Blues Jam'}
              spotName={'Moe Club'}
              tags={['Blues', 'Improvisation', 'Rock']}
              address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
              time={'Tuesday, Oct 21 - 12:00 PM'}
              src={'/images/sydney3.jpg'}
            />

            <JamCardShadcn
              jamName={'Tonky Blues Jam'}
              spotName={'Moe Club'}
              tags={['Blues', 'Improvisation', 'Rock']}
              address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
              time={'Tuesday, Oct 21 - 12:00 PM'}
              src={'/images/sydney3.jpg'}
            />
          </div>
          <div className="w-3/4 h-144">
            <MapRender />
          </div>
        </div>
        <JamCardShadcn
          classname="mt-32"
          jamName={'Tonky Blues Jam'}
          spotName={'Moe Club'}
          tags={['Blues', 'Improvisation', 'Rock']}
          address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
          time={'Tuesday, Oct 21 - 12:00 PM'}
          src={'/images/sydney3.jpg'}
        />
      </div>
    </MapProvider>
  );
}
