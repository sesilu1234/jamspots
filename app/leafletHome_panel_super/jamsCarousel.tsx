import JamCardShadcn from './CardJam';
import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function JamCarousel({ jams, setJams, loading, setLoading }) {
  const [collapsed, setCollapsed] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchJams = async () => {
      try {
        const res = await fetch('/api/get-jams-cards');
        if (!res.ok) throw new Error('Failed to fetch jams');
        const data: Jam[] = await res.json();
        setJams(data);
        console.log('Fetched jams:', data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJams();
  }, []);

  // observer-based uncollapse

  return (
    <div className={`flex flex-col absolute top-8 left-18 z-[500] gap-1 `}>
      {/* Collapse button */}
      <div
        className="p-2 flex items-center justify-center rounded-t-sm
               bg-gray-700/75 text-white cursor-pointer
               hover:bg-gray-600/75 transition-all duration-200"
        onClick={() => setCollapsed(!collapsed)}
      >
        {!collapsed ? 'Collapse cards' : 'Show cards'}
      </div>

      {/* Card container */}
      <div
        ref={containerRef}
        style={{ overflowY: 'auto', transition: 'all 1.0s ease' }}
        className={`card-container flex flex-col items-center bg-white border border-black/20 gap-6
    ${collapsed ? 'h-0 p-0 opacity-0' : 'h-108 p-6 opacity-100'}`}
      >
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          jams.map((jam, index) => (
            <JamCardShadcn
              key={index}
              classname="cursor-pointer"
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
