'use client';

import { useEffect, useRef, useState } from 'react';
import { TileLayer } from 'react-leaflet';

/**
 * The basemap: Stadia's Alidade Bright.
 *
 * Not theme-aware on purpose — one basemap was chosen deliberately, and a map
 * that flips between light and dark under the same amber pins would need two
 * sets of marker colours to stay legible.
 *
 * AUTHENTICATION
 * Stadia accepts either an API key in the URL or the requesting domain being
 * registered in their dashboard, and it serves localhost freely either way.
 * Domain auth is preferable here: a tile key has to travel to the browser to
 * be usable, so NEXT_PUBLIC_STADIA_API_KEY is readable by anyone who opens
 * devtools, and someone else could spend your quota with it. A registered
 * domain can't be lifted the same way — a copied Referer header doesn't help
 * an attacker serving from their own site.
 *
 * So the key is optional. If it isn't set we still request Stadia, which works
 * on localhost and on any domain you've registered.
 *
 * If those tiles fail — no key, unregistered domain, quota exhausted, Stadia
 * down — we switch to Esri's Light Gray Canvas, which needs no key at all. A
 * plainer map is far better than an empty grey rectangle.
 *
 * That switch is temporary, not a verdict. Leaflet asks for twenty-odd tiles
 * at once when the map first opens, so a rate limit lands on all of them
 * together and trips the counter instantly - and the most common reasons for
 * it are the ones that pass on their own. Latching for the whole session meant
 * one bad second at load left the visitor on the plain basemap until they
 * happened to reload.
 */

const STADIA_KEY = process.env.NEXT_PUBLIC_STADIA_API_KEY;

const STADIA_URL = `https://tiles.stadiamaps.com/tiles/alidade_bright/{z}/{x}/{y}{r}.png${
  STADIA_KEY ? `?api_key=${STADIA_KEY}` : ''
}`;

const STADIA_ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** How long to sit on the fallback before giving Stadia another go. */
const RETRY_AFTER_MS = 10_000;

/** One attempt to return, after which the plain basemap is accepted for good. */
const MAX_RETRIES = 1;

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services';
const ESRI_ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors';

export default function MapTileSwitcher({
  selectedIndex,
}: {
  /** Kept so existing call sites don't break; there is one basemap now. */
  selectedIndex?: number;
}) {
  const [stadiaFailed, setStadiaFailed] = useState(false);

  // A single failed tile is NOT enough to condemn the layer: tiles legitimately
  // 404 over open water, past the edge of coverage, and on flaky connections.
  // Only a run of failures with nothing loading in between means the layer is
  // actually broken — which is what an auth or quota problem looks like, since
  // then every single tile fails.
  const consecutiveFailures = useRef(0);
  const retriesLeft = useRef(MAX_RETRIES);

  /**
   * Falling back is instant, so the visitor always has a map to look at, but
   * the layer gets retried in the background. If Stadia has recovered the map
   * quietly turns back into the good one; if it has not, the retry costs a few
   * tile requests and we settle on Esri.
   */
  useEffect(() => {
    if (!stadiaFailed || retriesLeft.current <= 0) return;

    const timer = setTimeout(() => {
      retriesLeft.current -= 1;
      consecutiveFailures.current = 0;
      setStadiaFailed(false);
    }, RETRY_AFTER_MS);

    return () => clearTimeout(timer);
  }, [stadiaFailed]);

  if (!stadiaFailed) {
    return (
      <TileLayer
        noWrap
        key="stadia-alidade-bright"
        url={STADIA_URL}
        attribution={STADIA_ATTRIBUTION}
        maxZoom={20}
        eventHandlers={{
          tileerror: () => {
            consecutiveFailures.current += 1;
            if (consecutiveFailures.current >= 8) setStadiaFailed(true);
          },
          tileload: () => {
            consecutiveFailures.current = 0;
          },
        }}
      />
    );
  }

  return (
    <>
      <TileLayer
        noWrap
        key="esri-base"
        url={`${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`}
        attribution={ESRI_ATTRIBUTION}
        // Canvas is only rendered to z16; without this the map goes blank when
        // you zoom into a street. Esri also orders the path {z}/{y}/{x}.
        maxNativeZoom={16}
        maxZoom={19}
      />
      {/* Esri keeps place names in a separate reference layer. */}
      <TileLayer
        noWrap
        key="esri-labels"
        url={`${ESRI}/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`}
        maxNativeZoom={16}
        maxZoom={19}
      />
    </>
  );
}
