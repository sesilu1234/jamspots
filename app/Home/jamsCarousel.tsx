import JamCardShadcn from './CardJam';
import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function JamCarousel({
  jams,
  setJams,
  loading,
  setLoading,
  searchType,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(999999999);
    searchType === 'local' ? setCollapsed(false) : setCollapsed(true);
  }, [searchType]);

  // observer-based uncollapse

  return (
    <div className={`flex flex-col absolute top-8 left-18 z-[500] gap-1 `}>
      {/* Collapse button */}
      <div
        className="p-2 flex items-center justify-center rounded-t-sm
               bg-info/80 text-white cursor-pointer
               hover:bg-info/95 transition-all duration-200"
        onClick={() => setCollapsed(!collapsed)}
      >
        {!collapsed ? 'Collapse cards' : 'Show cards'}
      </div>

      {/* Card container */}
      <div
        ref={containerRef}
        className={`
    card-container flex flex-col items-center bg-tone-3/45 rounded-b-xl border border-black/20 gap-6
    overflow-y-auto transition-all duration-700 ease-in-out
    ${collapsed ? 'max-h-0 p-0 opacity-0' : 'max-h-108 p-6 pr-4 opacity-100'}
   
  `}
      >
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : jams.length === 0 ? (
          searchType === 'global' ? (
            <div className="p-2  text-center font-light w-64">
              Cards not available with global search
            </div>
          ) : (
            <div className="p-2  text-center  w-64">No jams found</div>
          )
        ) : (
          jams.map((jam, index) => (
            <JamCardShadcn
              key={index}
              classname="cursor-pointer border-2 border-white/75"
              jamName={jam.jam_title}
              spotName={jam.location_title}
              tags={jam.styles}
              address={jam.location_address}
              time={jam.date}
              src={jam.image}
              slug={jam.slug}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3  w-64 ">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
