import 'server-only';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DateTime } from 'luxon';
import tzlookup from 'tz-lookup';
import { find as geoTz } from 'geo-tz';

import { JamCard } from '@/types/jam'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const dateOptions = searchParams.get('dateOptions')!;
    const order = searchParams.get('order')!; // 'closeness' o 'popular'
    const lat = parseFloat(searchParams.get('lat')!);
    const lng = parseFloat(searchParams.get('lng')!);
    const distance = parseFloat(searchParams.get('distance')!) * 1000 || 80000;
    const stylesParam = searchParams.get('styles');
    const modalityParam = searchParams.get('modality');

    const dateOptionsInput = (dateOptions as string) ?? 'today';

    // 1. Determine the timezone of the search location
    const latitude = lat;
    const longitude = lng;

    const tz = (() => {
      if (!lat || !lng) return 'UTC'; // fallback if no coords

      try {
        return geoTz(lat, lng)[0] || 'UTC';
      } catch (e) {
        console.warn('geoTz failed, falling back to tz-lookup');
        return tzlookup(lat, lng) || 'UTC';
      }
    })();

    // 2. Calculate UTC Bounds using local search time
    const localNow = DateTime.now().setZone(tz);
    let gte: string;
    let lte: string;

    if (dateOptionsInput === 'today') {
      /** * TODAY: [Now - 2h] until [Midnight + 2h]
       * This covers Jams that just started and late-night finishers.
       */
      gte = localNow.minus({ hours: 2 }).toUTC().toISO()!;
      lte = localNow.endOf('day').plus({ hours: 2 }).toUTC().toISO()!;
    } else if (dateOptionsInput === 'week') {
      /** * THIS WEEK: [Now] until [7 days from now + 4h]
       * A rolling 7-day window with a 4h buffer for the final night.
       */
      gte = localNow.toUTC().toISO()!;
      lte = localNow
        .plus({ days: 7 })
        .endOf('day')
        .plus({ hours: 2 })
        .toUTC()
        .toISO()!;
    } else if (dateOptionsInput.startsWith('custom:')) {
  const dateStr = dateOptionsInput.split(': ')[1]; // "1980-01-01"

  const customDate = DateTime.fromISO(dateStr, { zone: tz });

  gte = customDate.startOf('day').toUTC().toISO(); // 00:00 of that day in tz → UTC
  lte = customDate.endOf('day').toUTC().toISO();   // 23:59:59.999 of same day in tz → UTC
}
 else {
      // "Don't send incomplete info heh"
      throw new Error(`Invalid or missing dateOptions`);
    }

    // 3. Parse arrays for Postgres (safely handle JSON strings from URL)
    const stylesArray = stylesParam ? JSON.parse(stylesParam as string) : null;
    const modalityArray = modalityParam
      ? JSON.parse(modalityParam as string)
      : null;

    // 4. Call the optimized RPC function
    const { data, error } = await supabaseAdmin.rpc('get_jams_filtered_v2', {
      p_lat: latitude,
      p_lng: longitude,
      p_distance_meters: distance, // km to meters
      p_start_utc: gte,
      p_end_utc: lte,
      p_filter_styles:
        stylesArray && stylesArray.length > 0 ? stylesArray : null,
      p_filter_modalities:
        modalityArray && modalityArray.length > 0 ? modalityArray : null,
    });

    type SortOrder = 'soonest' | 'popular';

    const sortData = (data: JamCard[], order: SortOrder) => {
      const sorters: Record<SortOrder, (a: JamCard, b: JamCard) => number> = {
        // 1. Soonest: Compare ISO strings directly (fastest)
        soonest: (a, b) => {
          const dateA = a.next_date || '9999-12-31'; // Push nulls to the end
          const dateB = b.next_date || '9999-12-31';
          return dateA.localeCompare(dateB);
        },
        // 2. Popular: Simple numeric subtraction
        popular: (a, b) => (b.priority_score || 0) - (a.priority_score || 0),
      };

      return [...data].sort(sorters[order]);
    };

    // --- Implementation ---
    const orderedData = sortData(data || [], order as SortOrder).map((jam) => {
      const localTime = jam.next_date
        ? DateTime.fromISO(jam.next_date, { zone: 'utc' }).setZone(
            jam.jam_timezone,
          )
        : null;

      return {
        ...jam,
        image: jam.images?.[0] || null,
        next_date_local: localTime?.toISO() || null,
        display_date: localTime
          ? localTime.toFormat('ccc d LLL, HH:mm')
          : 'Date TBD',
      };
    });

    if (error) {
      console.error('Supabase RPC Error:', error.message);
      throw error;
    }

    return NextResponse.json(orderedData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    console.error('getHomeCards failure:', message);

    return NextResponse.json(
      { error: 'Failed to fetch jams', details: message },
      { status: 500 },
    );
  }
}
