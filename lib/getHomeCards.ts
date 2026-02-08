import 'server-only';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DateTime } from 'luxon';
import { find as geoTz } from 'geo-tz';
import { JamCard } from '@/types/jam'; // Adjust path as needed

export const getHomeCards = async (searchParams: { [key: string]: string | string[] | undefined }) => {
  try {
    const { 
      dateOptions, 
      lat, 
      lng, 
      distance, 
      styles, 
      modality,
      order
    } = searchParams;

    const dateOptionsInput = (searchParams.dateOptions as string) ?? 'today';

    // 1. Determine the timezone of the search location
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const tz = (latitude && longitude) ? (geoTz(latitude, longitude)[0] || 'UTC') : 'UTC';

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
     
      }

      else if (dateOptionsInput === 'week') {
        /** * THIS WEEK: [Now] until [7 days from now + 4h]
         * A rolling 7-day window with a 4h buffer for the final night.
         */
        gte = localNow.toUTC().toISO()!;
        lte = localNow.plus({ days: 7 }).endOf('day').plus({ hours: 2 }).toUTC().toISO()!;
        

        }

       else if (dateOptionsInput.startsWith('custom:')) {
        /** * CUSTOM: [Start Date 00:00] until [End Date + 1 day 02:00]
         * Interprets the user's selected days in the local timezone of the Jam.
         */

        const dateStr = dateOptionsInput.split(':')[1];
  const customDate = DateTime.fromISO(dateStr);
        if (!customDate) throw new Error("Missing custom date range");
        
        gte = DateTime.fromISO(customDate as string, { zone: tz })
          .toUTC()
          .toISO()!;
        
        lte = DateTime.fromISO(customDate as string, { zone: tz })
          .toUTC()
          .toISO()!;
     

      }

      else {
        // "Don't send incomplete info heh"
        throw new Error(`Invalid or missing dateOptions`);
    }

    // 3. Parse arrays for Postgres (safely handle JSON strings from URL)
    const stylesArray = styles ? JSON.parse(styles as string) : null;
    const modalityArray = modality ? JSON.parse(modality as string) : null;

  

    // 4. Call the optimized RPC function
    const { data, error } = await supabaseAdmin.rpc('get_jams_filtered_v2', {
      p_lat: latitude,
      p_lng: longitude,
      p_distance_meters: parseFloat(distance as string || '60') * 1000, // km to meters
      p_start_utc: gte,
      p_end_utc: lte,
      p_filter_styles: stylesArray && stylesArray.length > 0 ? stylesArray : null,
      p_filter_modalities: modalityArray && modalityArray.length > 0 ? modalityArray : null
    });







let dataRes = (data as JamCard[] | null)?.map((jam: JamCard) => {
  // 1. Parse the UTC string
  // 2. Shift the perspective to the jam's timezone
  const localTime = jam.next_date 
    ? DateTime.fromISO(jam.next_date, { zone: 'utc' }).setZone(jam.jam_timezone)
    : null;

  return {
    ...jam,
    image: jam.images?.[0] || null,
    // Format it for the UI (e.g., "2026-02-07T20:00:00")
    // Or use .toFormat('ccc dd LLL, HH:mm') for "Sat 07 Feb, 20:00"
    next_date_local: localTime ? localTime.toISO() : null,
    display_date: localTime ? localTime.toFormat('ccc d LLL, HH:mm') : 'Date TBD'
  };
}) || [];

    if (error) {
      console.error('Supabase RPC Error:', error.message);
      throw error;
    }



    // Map the flat SQL response to a clean object if needed
    return dataRes;

  } catch (error: any) {
    console.error('getHomeCards failure:', error.message);
    return null;
  }
};