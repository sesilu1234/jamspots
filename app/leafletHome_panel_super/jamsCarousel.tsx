import JamCardShadcn from './CardJam';
import { useState } from 'react';

export default function JamCarousel() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`flex flex-col absolute top-24 left-4 z-[500] gap-1`}>
  {/* Collapse button */}
  <div
    className="p-2 flex items-center justify-center rounded-t-xl
               bg-gray-700/75 text-white cursor-pointer
               hover:bg-gray-600/75 transition-colors duration-200"
    onClick={() => setCollapsed(!collapsed)}
  >
    {!collapsed ? 'Collapse cards' : 'Show cards'}
  </div>

  {/* Card container */}
  <div
   style={{ overflowY: 'auto'}}
    className={` card-container 
      flex flex-col
      overflow-y-auto
      bg-white border border-black/20
      gap-6
      transition-all duration-300
      ${collapsed ? 'h-0 p-0' : 'h-108 p-6'}
    `}
  >




        <JamCardShadcn
          classname=""
          jamName={'Tonky Blues Jam'}
          spotName={'Moe Club'}
          tags={['Blues', 'Improvisation', 'Rock']}
          address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
          time={'Tuesday, Oct 21 - 12:00 PM'}
          src={'/images/sydney3.jpg'}
        />

        <JamCardShadcn
          classname=""
          jamName={'Tonky Blues Jam'}
          spotName={'Moe Club'}
          tags={['Blues', 'Improvisation', 'Rock']}
          address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
          time={'Tuesday, Oct 21 - 12:00 PM'}
          src={'/images/sydney3.jpg'}
        />

        <JamCardShadcn
          classname=""
          jamName={'Tonky Blues Jam'}
          spotName={'Moe Club'}
          tags={['Blues', 'Improvisation', 'Rock']}
          address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
          time={'Tuesday, Oct 21 - 12:00 PM'}
          src={'/images/sydney3.jpg'}
        />

        <JamCardShadcn
          classname=""
          jamName={'Tonky Blues Jam'}
          spotName={'Moe Club'}
          tags={['Blues', 'Improvisation', 'Rock']}
          address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
          time={'Tuesday, Oct 21 - 12:00 PM'}
          src={'/images/sydney3.jpg'}
        />

        <JamCardShadcn
          classname=""
          jamName={'Tonky Blues Jam'}
          spotName={'Moe Club'}
          tags={['Blues', 'Improvisation', 'Rock']}
          address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
          time={'Tuesday, Oct 21 - 12:00 PM'}
          src={'/images/sydney3.jpg'}
        />

        <JamCardShadcn
          classname=""
          jamName={'Tonky Blues Jam'}
          spotName={'Moe Club'}
          tags={['Blues', 'Improvisation', 'Rock']}
          address={' Av. de Alberto de Alcocer, 32, Chamartín, 28036 Madrid'}
          time={'Tuesday, Oct 21 - 12:00 PM'}
          src={'/images/sydney3.jpg'}
        />
      </div>
    </div>
  );
}
