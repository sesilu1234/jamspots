import JamCardShadcn from '@/components/map/CardJam';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { JamCard } from '@/types/jam';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

type JamCarouselProps = {
  jams: JamCard[];
  loading: boolean;
  searchType: 'local' | 'global';
};

type Snap = 'peek' | 'half' | 'full';

/**
 * Sheet height at rest in the peek state.
 *
 * It has to fit the handle and one row card exactly, because in peek the
 * sheet is transparent and `overflow-visible` — anything taller spills past
 * the sheet and gets clipped by the map, which is `overflow-hidden`.
 * Handle 52 + card 104 + the list's own 8 top and 16 bottom = 180.
 */
const PEEK_H = 188;

/**
 * The frosted pane behind the expanded list: the map, still the map, just
 * blurred and pushed back so the cards are what your eye lands on.
 *
 * Two knobs, and they pull against each other. The blur is what makes it read
 * as glass, but the more of it, the less map: past about 10px a city map at
 * phone scale stops looking like a map at all — the streets melt and you are
 * back to a flat wash, which is the thing this is meant not to be. The tint is
 * what darkens it; too much and the blur underneath stops mattering.
 *
 * At 4px and 22% the map is still readable through the glass — labels turn to
 * smudges, but the streets and the water keep their shape. Raise the blur to
 * push the map further back, and raise the tint with it if the header text
 * starts to fight whatever is underneath.
 *
 * Kept in `style` rather than as Tailwind classes because `backdrop-filter` is
 * the one property here that has to survive a vendor prefix: iOS Safari still
 * only takes `-webkit-backdrop-filter`, and without it the whole effect on a
 * phone degrades to exactly the flat tint we are trying to get away from.
 */
const SHEET_TINT = 'bg-surface-inset/22';
const SHEET_BLUR = 'blur(2px) saturate(1.2)';

/** Matches the FLIP duration in the slide effect. */
const SLIDE_MS = 300;

/**
 * useLayoutEffect, minus the server warning. The slide below has to set its
 * starting transform before the browser paints, so useEffect is not an
 * option — it would paint one frame at the destination first.
 */
const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Fractions of the map's height for the two expanded stops. */
const HALF_F = 0.52;
const FULL_F = 0.9;

/**
 * The jam list over the map: a bottom sheet on the phone, the original
 * floating panel from md up.
 *
 * Phone. Three stops, in the Google Maps / Airbnb shape. `peek` is a strip
 * above the tab bar holding a horizontal carousel of row cards; `half` and
 * `full` are the vertical list of poster cards.
 *
 * In peek the sheet is transparent, and it now behaves that way too: the
 * sheet takes `pointer-events-none` and hands it back only to the cards and
 * to the pill. It used to be a full-width, 188px-tall invisible div with a
 * full-width drag bar across the top of it, so the bottom quarter of the map
 * could not be panned, pinched or tapped — the strip was catching everything
 * aimed at the map behind it. The only things that answer a finger there now
 * are the cards themselves and the "N jams" pill.
 *
 * Desktop. Untouched: the panel at the top left of the map, with the
 * "Hide cards" button and its max-height collapse.
 *
 * Note the `max-md:` on every `group-data-[snap=…]` below, here and in
 * CardJam. `snap` starts at 'peek' on the server for everyone, desktop
 * included, so without it the desktop panel would lay itself out as a
 * horizontal strip until hydration corrected it.
 */
export default function JamCarousel({
  jams,
  loading,
  searchType,
}: JamCarouselProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [snap, setSnap] = useState<Snap>('peek');

  /** Live height while a drag is in progress; null when resting on a stop. */
  const [dragH, setDragH] = useState<number | null>(null);

  /** Measured height of the map — the stops are fractions of it. */
  const [mapH, setMapH] = useState(0);

  const sheetRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; h: number; moved: boolean } | null>(null);

  /** Set for a moment after the sheet moves itself; read in onClickCapture. */
  const swallowClick = useRef(false);

  /** The height the sheet was at last paint, for the slide effect below. */
  const prevH = useRef<number | null>(null);

  const stops: Record<Snap, number> = {
    peek: PEEK_H,
    half: mapH ? Math.max(PEEK_H, Math.round(mapH * HALF_F)) : PEEK_H,
    full: mapH ? Math.max(PEEK_H, Math.round(mapH * FULL_F)) : PEEK_H,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (searchType === 'local') {
      setCollapsed(false);
    } else {
      setCollapsed(true);
      setSnap('peek');
    }
  }, [searchType]);

  // No effect here opens the sheet on a new result set, on purpose. An empty
  // result used to expand it to `half`, so that the empty-state copy got a
  // background instead of sitting as white text on the map — but on a phone
  // that copy is `hidden` at peek anyway, and every search that comes back
  // empty for a moment before the jams land counts as one. Arriving at a city
  // threw the list open over the map you had just asked to see. The "No jams
  // here" pill says the same thing from the strip, and the stop the sheet is
  // at stays the reader's choice.

  // The strip keeps the scroll offset of the previous results, so without
  // this a new search opens part-way along the list.
  useEffect(() => {
    listRef.current?.scrollTo({ left: 0, top: 0 });
  }, [jams]);

  function nearestSnap(h: number): Snap {
    return (Object.keys(stops) as Snap[]).reduce((best, key) =>
      Math.abs(stops[key] - h) < Math.abs(stops[best] - h) ? key : best,
    );
  }

  /** Arms the click swallower on the sheet. See that handler for why. */
  function armClickGuard() {
    swallowClick.current = true;
    setTimeout(() => {
      swallowClick.current = false;
    }, 400);
  }

  /** The stops in order, so stepping is an index move rather than a lookup. */
  const ORDER: Snap[] = ['peek', 'half', 'full'];

  function step(by: 1 | -1) {
    armClickGuard();
    const next = ORDER[ORDER.indexOf(snap) + by];
    if (next) setSnap(next);
  }

  function expand() {
    armClickGuard();
    setSnap('half');
  }

  /** The nub's own tap: up, or back down once there is nowhere left to go. */
  function stepFromNub() {
    step(snap === 'full' ? -1 : 1);
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
    setDragH(Math.min(Math.max(d.h + delta, PEEK_H), stops.full));
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    if (d.moved) {
      setSnap(nearestSnap(dragH ?? d.h));
      armClickGuard();
    } else {
      stepFromNub();
    }

    setDragH(null);
  }

  const dragging = dragH !== null;
  const targetH = dragH ?? stops[snap];

  /**
   * Whether the frosted pane below is showing: at every stop but peek, where
   * the sheet is a transparent strip over live map.
   */
  const glass = snap !== 'peek';

  /**
   * The slide, done as a FLIP rather than as a height transition.
   *
   * Transition the sheet's HEIGHT and every frame of the slide is a fresh
   * layout of the card list, on the main thread — which is the stutter.
   *
   * So the height is not animated at all. It jumps straight to the new stop,
   * the element is put back where it was with a transform, and only that
   * transform is animated: one layout, then a slide the compositor can run on
   * its own, with the glass pane along for the ride.
   *
   * Skipped while a finger is down — there the height already follows the
   * drag frame by frame, and animating on top of that would fight it.
   */
  useIsoLayoutEffect(() => {
    const el = sheetRef.current;
    const from = prevH.current;
    prevH.current = targetH;

    if (!el || from === null || from === targetH || dragging) return;

    el.style.transition = 'none';
    el.style.transform = `translateY(${targetH - from}px)`;

    const id = requestAnimationFrame(() => {
      el.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`;
      el.style.transform = 'translateY(0px)';
    });

    return () => cancelAnimationFrame(id);
  }, [targetH, dragging]);
  const countLabel = loading
    ? 'Searching…'
    : jams.length === 0
      ? 'No jams here'
      : `${jams.length} ${jams.length === 1 ? 'jam' : 'jams'}`;

  return (
    <div
      ref={sheetRef}
      data-snap={snap}
      style={{ '--sheet-h': `${targetH}px` } as React.CSSProperties}
      onClickCapture={(e) => {
        // A tap that moves the sheet leaves the finger sitting wherever a
        // card has just arrived, and the browser then sends the click there —
        // which is how opening the list dropped you into a jam you never
        // picked. Swallow the one click that follows a move of our own.
        if (!swallowClick.current) return;
        swallowClick.current = false;
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`group/sheet absolute inset-x-0 bottom-0 z-50 flex h-[var(--sheet-h)] flex-col overflow-hidden rounded-t-2xl border-x-0 border-b-0 border-t border-tone-0/10 shadow-[0_-8px_24px_rgba(0,0,0,0.28)]
        ${searchType === 'global' ? 'max-md:hidden' : ''}
        max-md:data-[snap=peek]:pointer-events-none
        data-[snap=peek]:overflow-visible data-[snap=peek]:border-t-transparent data-[snap=peek]:shadow-none
        md:inset-auto md:top-8 md:left-18 md:h-auto md:max-w-[95%] md:gap-1 md:overflow-visible md:rounded-none md:border-0 md:shadow-none`}
    >
      {/* The glass, as a layer of its own rather than a background on the
          sheet — and this is the part that keeps it from costing anything.

          A `backdrop-filter` element is re-sampled whenever its own box
          changes, and the sheet's box changes constantly: every frame of a
          drag, every snap. Put the filter on the sheet and each of those
          frames is a fresh blur of a differently sized slice of map, on the
          main thread, while the card list re-lays out on top of it.

          So this pane is sized once, to the tallest the sheet ever gets, and
          pinned to the bottom. Dragging the sheet no longer resizes it — it
          only moves the parent's clip, which the compositor already does for
          free. The blur is re-sampled when the map itself moves, and not
          otherwise.

          Behind the content via `-z-10`, out of the way of every finger, and
          absent at `peek`, where the sheet is a transparent strip and blurring
          the band the map is supposed to show through would defeat the point.
          Off by opacity rather than by unmounting: an unmount drops the
          composited layer and the next expand has to build it again, which is
          a hitch you can see. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 -z-10 md:hidden ${SHEET_TINT} ${
          glass ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          height: Math.max(stops.full, PEEK_H),
          backdropFilter: glass ? SHEET_BLUR : undefined,
          WebkitBackdropFilter: glass ? SHEET_BLUR : undefined,
        }}
      />
      {/* Phone, peek. A row in the markup, but not on screen: the row is
          inert and only the pill inside it takes a finger, so everything
          around the pill is still map. This is the whole of the sheet's
          furniture at this stop — the strip below it has no header. */}
      {snap === 'peek' ? (
        <div className="pointer-events-none flex shrink-0 px-3 pt-2 pb-1 md:hidden">
          <button
            type="button"
            onClick={expand}
            aria-label="Expand jam list"
            className="pointer-events-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0c0e12d9] px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-colors active:bg-[#0c0e12]"
          >
            {countLabel}
            <ChevronUp className="size-3.5 text-white/70" />
          </button>
        </div>
      ) : (
        /* Phone, expanded. The nub is the grip: tap it to go up a stop, or
           back down to the strip once there is nowhere left to go, and drag
           it to size the sheet by hand. It is the only thing in the sheet
           that answers a drag, which is what stops a drag ending inside a
           card. touch-action none, or the browser pans the map under it. */
        <div
          role="button"
          tabIndex={0}
          aria-label={snap === 'full' ? 'Collapse jam list' : 'Expand jam list'}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              stepFromNub();
            }
          }}
          style={{ touchAction: 'none' }}
          className="flex shrink-0 cursor-grab flex-col items-center gap-1.5 px-4 pt-2.5 pb-2 select-none active:cursor-grabbing md:hidden"
        >
          <span className="h-1.5 w-11 rounded-full bg-tone-0/30" />

          <span className="w-full text-sm font-semibold text-tone-0">
            {countLabel}
          </span>
        </div>
      )}

      {/* The two steps, as buttons rather than only as a gesture.
          Bottom right, not up in the header: at the `full` stop the header is
          near the top of the screen, which is the one place a thumb cannot
          reach on a tall phone — and the taller the sheet, the more likely
          you want to shrink it again. Down here both stay under the thumb at
          every stop.

          Stacked rather than side by side because the cards are w-64 and
          centred: a 36px column clears the card edge on a normal phone,
          where an 80px row would not. Both stay mounted, the disabled one
          included, so neither moves under a finger that is about to tap. */}
      {snap !== 'peek' ? (
        <div className="absolute right-3 bottom-4 z-10 flex flex-col gap-2 md:hidden">
          <StepButton
            label="Make the jam list taller"
            onClick={() => step(1)}
            disabled={snap === 'full'}
          >
            <ChevronUp className="size-4" />
          </StepButton>

          <StepButton
            label="Make the jam list smaller"
            onClick={() => step(-1)}
          >
            <ChevronDown className="size-4" />
          </StepButton>
        </div>
      ) : null}

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
          max-md:group-data-[snap=peek]/sheet:flex-row max-md:group-data-[snap=peek]/sheet:gap-3 max-md:group-data-[snap=peek]/sheet:overflow-x-auto max-md:group-data-[snap=peek]/sheet:overflow-y-hidden max-md:group-data-[snap=peek]/sheet:px-3 max-md:group-data-[snap=peek]/sheet:pt-2 max-md:group-data-[snap=peek]/sheet:pb-6
          max-md:group-data-[snap=peek]/sheet:[&>*]:pointer-events-auto
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
            <div className="animate-fadeIn mx-auto flex w-full max-w-sm shrink-0 flex-col items-center justify-center p-4 text-center max-md:group-data-[snap=peek]/sheet:hidden md:p-8">
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

            {/* Last in the strip, at every count rather than below some
                threshold. Inviting a contribution is never wrong, and a cutoff
                would make the card vanish the moment a city reached it.

                Not pinned to the bottom of the scroller: tried that, and a bar
                floating over the cards cut the one behind it in half. An
                invitation is worth less than the content it would cover.

                Worded as an invitation on purpose. The empty state can afford
                to say the stage is quiet; the visitor is already looking at
                nothing. Saying it to someone who just found three jams tells
                them the city is dead when they had not thought so. */}
            <Link
              href="/host"
              className="group/add flex w-64 shrink-0 flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-tone-0/25 bg-card-jams/40 px-4 py-6 text-center transition-colors duration-200 hover:border-tone-0/45 hover:bg-card-jams/70 max-md:group-data-[snap=peek]/sheet:w-[78vw] max-md:group-data-[snap=peek]/sheet:max-w-[320px] max-md:group-data-[snap=peek]/sheet:flex-row max-md:group-data-[snap=peek]/sheet:gap-3 max-md:group-data-[snap=peek]/sheet:py-4 max-md:group-data-[snap=peek]/sheet:text-left"
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
  );
}

/**
 * One of the two stop buttons floating over the phone sheet.
 *
 * `onPointerDown` stops here rather than reaching the nub's drag handlers on
 * the way up: without that a tap on the button counts as a tap on the nub as
 * well, and the sheet steps twice for one press.
 */
function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-tone-0/12 bg-surface-raised text-tone-0/70 shadow-lg transition-colors active:bg-surface-inset disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}

/**
 * Shaped like whichever card it stands in for — the row in peek, the poster
 * otherwise. One fixed shape made the sheet jump the moment the real cards
 * landed.
 */
export function SkeletonCard() {
  return (
    <div className="flex w-64 shrink-0 flex-col space-y-3 max-md:group-data-[snap=peek]/sheet:w-[78vw] max-md:group-data-[snap=peek]/sheet:max-w-[320px] max-md:group-data-[snap=peek]/sheet:flex-row max-md:group-data-[snap=peek]/sheet:gap-3 max-md:group-data-[snap=peek]/sheet:space-y-0">
      <Skeleton className="h-[125px] w-full rounded-xl max-md:group-data-[snap=peek]/sheet:h-20 max-md:group-data-[snap=peek]/sheet:w-20 max-md:group-data-[snap=peek]/sheet:shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
