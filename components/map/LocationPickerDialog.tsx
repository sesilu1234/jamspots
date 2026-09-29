'use client';

import { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Check, MapPin, Search } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_API_KEY!;

export type PickedLocation = {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
};

type LocationPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Where the map opens, when a location has already been chosen. */
  initialCoords?: { lat: number; lng: number } | null;
  onPick: (location: PickedLocation) => void;
};

/** Somewhere in the Atlantic, i.e. "no opinion" — the whole world in frame. */
const WORLD_CENTER = { lat: 20, lng: 0 };

/**
 * Picking the venue, in a dialog over the form.
 *
 * This used to be `window.open('/createJam/selectOnMap')` talking back through
 * a BroadcastChannel. Three things were wrong with that on a phone, where most
 * of these are filled in: a popup opens as a whole new tab, so the form
 * vanishes and the tab strip is the only way back; the accept button sat below
 * the fold of that tab, so the map looked like a dead end; and popup blockers
 * simply swallow the call, leaving the button doing nothing at all.
 *
 * The layout is a fixed column — header, search, map, footer — so the accept
 * button is on screen from the first frame at every height. Nothing inside
 * scrolls except the map.
 */
export default function LocationPickerDialog({
  open,
  onOpenChange,
  initialCoords,
  onPick,
}: LocationPickerDialogProps) {
  /**
   * Google renders its suggestion list as `.pac-container`, a direct child of
   * <body> — outside the dialog as far as Radix is concerned. Left alone,
   * reaching for a suggestion counts as clicking outside and shuts the dialog
   * before the pick lands. (globals.css has the matching z-index and
   * pointer-events rules, because a modal also makes the body inert.)
   */
  const keepOpenForSuggestions = (e: {
    target: EventTarget | null;
    preventDefault: () => void;
  }) => {
    const el = e.target as HTMLElement | null;
    if (el?.closest?.('.pac-container')) e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={keepOpenForSuggestions}
        onInteractOutside={keepOpenForSuggestions}
        onFocusOutside={keepOpenForSuggestions}
        className="flex h-[88dvh] max-h-[680px] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border-zinc-200 bg-white p-0 text-zinc-900 sm:max-w-[600px]"
      >
        <PickerBody
          initialCoords={initialCoords}
          onPick={onPick}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * Everything inside the dialog.
 *
 * Split out so that `picked` is born with the dialog and dies with it — Radix
 * unmounts the content on close, so there is no stale selection to reset and
 * no effect watching `open` to do the resetting. Keeping it in the parent
 * meant reopening the map with the previous venue still in the footer and
 * "Use this location" looking armed for something the map was not showing.
 */
function PickerBody({
  initialCoords,
  onPick,
  onDone,
}: {
  initialCoords?: { lat: number; lng: number } | null;
  onPick: (location: PickedLocation) => void;
  onDone: () => void;
}) {
  const [picked, setPicked] = useState<PickedLocation | null>(null);

  const confirm = () => {
    if (!picked) return;
    onPick(picked);
    onDone();
  };

  return (
    <>
      <DialogHeader className="shrink-0 gap-1 border-b border-zinc-200 px-5 py-4 pr-12">
        <DialogTitle className="text-[15px] font-bold tracking-tight">
          Pick the location
        </DialogTitle>
        <DialogDescription className="text-[13px] text-zinc-500">
          Search the venue by name or address, then confirm below.
        </DialogDescription>
      </DialogHeader>

      <APIProvider apiKey={API_KEY} language="en">
        <div className="shrink-0 px-5 pt-4 pb-3">
          <PlaceAutocomplete onPlaceSelect={setPicked} />
        </div>

        <div className="relative min-h-0 flex-1 border-y border-zinc-200">
          <Map
            mapId="da37f3254c6a6d1c"
            defaultZoom={initialCoords ? 15 : 2}
            defaultCenter={initialCoords ?? WORLD_CENTER}
            gestureHandling="greedy"
            disableDefaultUI
            zoomControl
          >
            {/* Not draggable on purpose: a dragged pin has no street
                  address, and the listing needs a real one. The position
                  always comes from a Places result. */}
            {picked ? <AdvancedMarker position={picked.coordinates} /> : null}
          </Map>

          <PanToPick coords={picked?.coordinates ?? null} />
        </div>
      </APIProvider>

      <div className="flex shrink-0 items-end justify-between gap-3 px-5 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-zinc-400 uppercase">
            Selected
          </p>
          {picked ? (
            <>
              <p className="truncate text-[13px] font-semibold tracking-tight text-zinc-900">
                {picked.name || picked.address}
              </p>
              <p className="truncate text-[12px] text-zinc-500">
                {picked.address}
              </p>
            </>
          ) : (
            <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-zinc-500">
              <MapPin className="size-3.5 shrink-0" />
              Nothing yet — search for the venue above.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={confirm}
          disabled={!picked}
          className="
              inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-amber-400 px-4
              text-[13px] font-bold tracking-tight text-zinc-950 shadow-sm transition-all duration-200
              hover:bg-amber-300 hover:shadow-md
              focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:outline-none
              disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none
            "
        >
          <Check className="size-4" />
          Use this location
        </button>
      </div>
    </>
  );
}

/** Moves the map onto each new pick. Has to live under <Map> to see it. */
function PanToPick({
  coords,
}: {
  coords: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !coords) return;
    map.panTo(coords);
    map.setZoom(16);
  }, [map, coords]);

  return null;
}

function PlaceAutocomplete({
  onPlaceSelect,
}: {
  onPlaceSelect: (place: PickedLocation | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const location = place?.geometry?.location;

      // Pressing Enter without choosing a suggestion returns a stub with no
      // geometry. There is nothing to put on the map, so treat it as no pick.
      if (!location) {
        onPlaceSelect(null);
        return;
      }

      onPlaceSelect({
        name: place.name || '',
        address: place.formatted_address || '',
        coordinates: { lat: location.lat(), lng: location.lng() },
      });
    });

    return () => google.maps.event.clearInstanceListeners(autocomplete);
  }, [places, onPlaceSelect]);

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400" />
      <input
        ref={inputRef}
        placeholder="Search a venue, bar or address…"
        className="h-11 w-full rounded-xl border border-zinc-200 bg-white pr-3 pl-10 text-[14px] text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/25"
      />
    </div>
  );
}
