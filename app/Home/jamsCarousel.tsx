import JamCardShadcn from '@/components/map/CardJam';
import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { JamCard } from '@/types/jam';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

type JamCarouselProps = {
  jams: JamCard[];
  loading: boolean;
  searchType: 'local' | 'global';
};

type Snap = 'closed' | 'half' | 'full';

/** Fractions of the map's height for the two open stops. */
const HALF_F = 0.55;
const FULL_F = 0.9;

/**
 * Height used for the stops until the map has been measured. It only matters
 * for the first frame after mount — the ResizeObserver corrects it at once.
 */
const FALLBACK_MAP_H = 560;

/**
 * The jam list over the map: a bottom sheet on the phone, the original
 * floating panel from md up.
 *
 * Phone. Two open stops plus shut. At rest there is NOTHING over the map but
 * a small pill in the corner — no strip, no transparent sheet, no invisible
 * drag target. That strip used to sit 188px tall and full width whether or
 * not it had anything in it, so the bottom third of the map could not be
 * panned, pinched or tapped. The pill opens the sheet; the nub at the top of
 * the sheet drags it, or taps it shut.
 *
 * Desktop. Untouched: the panel at the top left of the map, with the
 * "Hide cards" button and its max-height collapse.
 *
 * `snap` starts at 'closed' on the server for everyone, desktop included, so
 * every rule keyed off it is written `max-md:`.
 */
export default function JamCarousel({
  jams,
  loading,
  searchType,
}: JamCarouselProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [snap, setSnap] = useState<Snap>('closed');

  /** Live height while a drag is in progress; null when resting on a stop. */
  const [dragH, setDragH] = useState<number | null>(null);

  /** Measured height of the map — the stops are fractions of it. */
  const [mapH, setMapH] = useState(0);

  const sheetRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; h: number; moved: boolean } | null>(null);

  /**
   * A tap that opens the sheet leaves the finger sitting where a card has
   * just arrived, and the browser then sends the click there — which opened a
   * jam nobody asked for. The sheet swallows the first click after any move
   * of its own.
   */
  const swallowClick = useRef(false);

  const usableH = mapH || FALLBACK_MAP_H;
  const stops: Record<Snap, number> = {
    closed: 0,
    half: Math.round(usableH * HALF_F),
    full: Math.round(usableH * FULL_F),
  };

  // Measured against the parent, the map, rather than the viewport: the map
  // is already 100dvh minus the two fixed bars, and repeating that sum here
  // is exactly how the two drift apart.
  useEffect(() => {
    const el = sheetRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setMapH(entry.contentRect.height),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (searchType === 'local') {
      setCollapsed(false);
    } else {
      setCollapsed(true);
      setSnap('closed');
    }
  }, [searchType]);

  // The one case that opens itself. An empty map says nothing about what to do
  // next, and the panel behind the pill is where "Add a Jam Spot" lives — so
  // with no results it comes up on its own. With results it stays shut and the
  // map is left alone.
  useEffect(() => {
    if (loading) return;
    if (searchType === 'local' && jams.length === 0) setSnap('half');
  }, [jams, loading, searchType]);

  // The list keeps the scroll offset of the previous results, so without this
  // a new search opens part-way down.
  useEffect(() => {
    listRef.current?.scrollTo({ left: 0, top: 0 });
  }, [jams]);

  function nearestSnap(h: number): Snap {
    return (Object.keys(stops) as Snap[]).reduce((best, key) =>
      Math.abs(stops[key] - h) < Math.abs(stops[best] - h) ? key : best,
    );
  }

  function armClickGuard() {
    swallowClick.current = true;
    setTimeout(() => {
      swallowClick.current = false;
    }, 400);
  }

  function openSheet() {
    armClickGuard();
    setSnap('half');
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = { y: e.clientY, h: dragH ?? stops[snap], moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const delta = d.y - e.clientY;
    // A few pixels of slop, so a tap that wobbles is still a tap.
    if (Math.abs(delta) > 4) d.moved = true;
    setDragH(Math.min(Math.max(d.h + delta, 0), stops.full));
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    if (d.moved) setSnap(nearestSnap(dragH ?? d.h));
    else setSnap('closed');

    armClickGuard();
    setDragH(null);
  }

  const dragging = dragH !== null;
  const countLabel = loading
    ? 'Searching…'
    : jams.length === 0
      ? 'No jams here'
      : `${jams.length} ${jams.length === 1 ? 'jam' : 'jams'}`;

  return (
    <>
      {/* The whole phone presence while the sheet is shut: one pill, sized to
          its own text, in the corner. Everything else is map. */}
      {searchType === 'local' && snap === 'closed' ? (
        <button
          type="button"
          onClick={openSheet}
          aria-label="Show the jam list"
          className="absolute bottom-3 left-3 z-50 flex items-center gap-1.5 rounded-full bg-[#0c0e12e6] px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm transition-colors active:bg-[#0c0e12] md:hidden"
        >
          {countLabel}
          <ChevronUp className="size-3.5 text-white/70" />
        </button>
      ) : null}

      <div
        ref={sheetRef}
        data-snap={snap}
        onClickCapture={(e) => {
          if (!swallowClick.current) return;
          swallowClick.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
        style={
          { '--sheet-h': `${dragH ?? stops[snap]}px` } as React.CSSProperties
        }
        className={`group/sheet absolute inset-x-0 bottom-0 z-50 flex h-[var(--sheet-h)] flex-col overflow-hidden rounded-t-2xl border-x-0 border-b-0 border-t border-tone-0/10 bg-surface-inset/62 shadow-[0_-8px_24px_rgba(0,0,0,0.28)] backdrop-blur-[18px] backdrop-saturate-[1.3]
        ${searchType === 'global' ? 'max-md:hidden' : ''}
        max-md:data-[snap=closed]:pointer-events-none max-md:data-[snap=closed]:border-t-transparent max-md:data-[snap=closed]:bg-transparent max-md:data-[snap=closed]:shadow-none max-md:data-[snap=closed]:backdrop-filter-none
        ${dragging ? '' : 'transition-[height] duration-300 ease-out'}
        md:inset-auto md:top-8 md:left-18 md:h-auto md:max-w-[95%] md:gap-1 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:backdrop-filter-none`}
      >
        {/* Phone nub. The grab target and the way back down in one, and the
            only thing in the sheet that answers a drag — which is why a drag
            can no longer end up inside a card.
            touch-action none, or the browser pans the map under the finger. */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Collapse jam list"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSnap('closed');
            }
          }}
          style={{ touchAction: 'none' }}
          className="flex shrink-0 cursor-grab flex-col items-center gap-1.5 px-4 pt-2.5 pb-2 select-none active:cursor-grabbing md:hidden"
        >
          <span className="h-1.5 w-11 rounded-full bg-tone-0/30" />

          <span className="flex w-full items-center justify-between">
            <span className="text-sm font-semibold text-tone-0">
              {countLabel}
            </span>
            <ChevronDown className="size-4 text-tone-0/40" />
          </span>
        </div>

        {/* Desktop header. Was a full-width bar reading "Collapse cards" with no
            indication of how many there were; the count is the useful part. */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          className={`hidden cursor-pointer items-center justify-between gap-3 border border-tone-0/10 bg-surface-raised/90 px-4 py-2.5 backdrop-blur-md transition-colors hover:bg-surface-raised light:border-tone-0/12 light:bg-surface-inset/95 light:hover:bg-surface-inset md:flex ${
            collapsed ? 'rounded-xl' : 'rounded-t-xl border-b-0'
          }`}
        >
          <span className="text-sm font-semibold text-tone-0">
            {collapsed ? 'Show cards' : 'Hide cards'}
          </span>

          <span className="flex items-center gap-2">
            {!loading && jams.length > 0 && (
              <span className="rounded-full bg-tone-0/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-tone-0/70">
                {jams.length}
              </span>
            )}
            <ChevronDown
              className={`size-4 text-tone-0/50 transition-transform duration-200 ${
                collapsed ? '' : 'rotate-180'
              }`}
            />
          </span>
        </button>

        {/* Card container */}
        <div
          ref={listRef}
          className={`card-container flex min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto px-4 pb-4
          md:flex-none md:gap-6 md:rounded-b-xl md:border md:border-black/20 md:bg-tone-3/45 md:transition-all md:duration-700 md:ease-in-out ${
            collapsed
              ? 'md:max-h-0 md:px-0 md:pt-0 md:pb-0 md:opacity-0'
              : 'md:max-h-108 md:px-6 md:pt-6 md:pr-4 md:pb-6 md:opacity-100'
          }`}
        >
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : jams.length === 0 ? (
            searchType === 'global' ? (
              <div className="w-full shrink-0 p-2 text-center font-light">
                Cards not available with global search
              </div>
            ) : (
              <div className="animate-fadeIn mx-auto flex w-full max-w-sm shrink-0 flex-col items-center justify-center p-4 text-center md:p-8">
                <h3 className="mb-2 text-lg font-bold tracking-tight uppercase">
                  No active jam sessions found here right now
                </h3>
                <p className="mb-6 text-sm font-medium text-text-2">
                  The stage is currently quiet... Help us find the music!
                </p>

                <Link
                  href="/host"
                  className="
    /* Layout & Text */
    px-4 py-4 md:px-4 md:py-3
    text-white font-black uppercase text-[10px] md:text-xs tracking-[0.2em]
    text-center whitespace-nowrap

    /* Colors & Border */
    bg-[#E63946] border-2 border-black

    /* Shadow & Animation */
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    transition-all duration-100 ease-in-out

    /* Hover (Desktop) */
    hover:bg-[#F1515E]
    hover:shadow-none
    hover:translate-x-[2px]
    hover:translate-y-[2px]

    /* Active (Mobile & Click) */
    active:bg-[#C12E39]
    active:shadow-none
    active:translate-x-[4px]
    active:translate-y-[4px]

    /* Box Model */
    inline-block flex items-center justify-center
  "
                >
                  + Add a Jam Spot
                </Link>

                <p className="mt-4 text-[10px] tracking-widest text-tone-0/80 uppercase">
                  Be the legend who starts the first one in this city
                </p>
              </div>
            )
          ) : (
            <>
              {jams.map((jam: JamCard, index: number) => (
                <JamCardShadcn
                  key={index}
                  classname="cursor-pointer border border-tone-0/10 bg-card-jams shadow-lg shadow-black/40"
                  jamName={jam.jam_title}
                  spotName={jam.location_title}
                  tags={jam.styles}
                  address={jam.location_address}
                  display_date={jam.display_date}
                  modality={jam.modality}
                  src={jam.image}
                  slug={jam.slug}
                />
              ))}

              {/* Last in the list, at every count rather than below some
                  threshold. Inviting a contribution is never wrong, and a
                  cutoff would make the card vanish the moment a city reached
                  it.

                  Not pinned to the bottom of the scroller: tried that, and a
                  bar floating over the cards cut the one behind it in half. An
                  invitation is worth less than the content it would cover.

                  Worded as an invitation on purpose. The empty state can
                  afford to say the stage is quiet; the visitor is already
                  looking at nothing. Saying it to someone who just found three
                  jams tells them the city is dead when they had not thought
                  so. */}
              <Link
                href="/host"
                className="group/add flex w-64 shrink-0 flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-tone-0/25 bg-card-jams/40 px-4 py-6 text-center transition-colors duration-200 hover:border-tone-0/45 hover:bg-card-jams/70"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-tone-0/25 text-tone-0 transition-transform duration-300 group-hover/add:rotate-90">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    aria-hidden="true"
                    className="h-5 w-5 fill-current"
                  >
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-bold tracking-tight text-tone-0">
                    Add a jam
                  </span>
                  <span className="block text-xs text-tone-0/60">
                    Know one we&apos;re missing?
                  </span>
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/** Stands in for a poster card while the results load. */
export function SkeletonCard() {
  return (
    <div className="flex w-64 shrink-0 flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
