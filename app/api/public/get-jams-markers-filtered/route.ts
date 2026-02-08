import 'server-only';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DateTime } from 'luxon';

import { NextResponse } from 'next/server';



    export async function GET(req: Request) {
  try {
    
    

    const { searchParams } = new URL(req.url);

    

    console.log(searchParams);

    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];


    const formatLocalDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate(),
      ).padStart(2, '0')}`;

 
    const dateOptions = searchParams.get('dateOptions')!;
    const stylesParam = searchParams.get('styles');
    const modalityParam = searchParams.get('modality');


    const dateOptionsInput = (dateOptions as string) ?? 'today';
    const stylesArray = stylesParam ? JSON.parse(stylesParam as string) : null;
    const modalityArray = modalityParam ? JSON.parse(modalityParam as string) : null;

    const utcNow = DateTime.utc();

    let gte: string;
    let lte: string;

    
      let dataMarkers, error;
  
      if (dateOptionsInput === 'all') {
        let query = supabaseAdmin
          .from('sessions_with_coords')
          .select('id, lat, lng')
          .eq('validated', true);

        if (Array.isArray(stylesParam) && stylesParam.length > 0) {
          query = query.overlaps('styles', stylesParam);
        }

        if (Array.isArray(modalityParam) && modalityParam.length > 0) {
          query = query.in('modality', modalityParam);
        }

        ({ data: dataMarkers, error } = await query);
       
     
      }

      else if (dateOptionsInput === 'week') {
        /** * THIS WEEK: [Now] until [7 days from now + 4h]
         * A rolling 7-day window with a 4h buffer for the final night.
         */
        gte = utcNow.toISO()!;
        lte = utcNow.plus({ days: 7 }).endOf('day').plus({ hours: 2 }).toISO()!;

            ( { data: dataMarkers, error } = await supabaseAdmin.rpc('get_markers_filtered_week_v2', {
      p_start_utc: gte,
      p_end_utc: lte,
      p_filter_styles: stylesArray && stylesArray.length > 0 ? stylesArray : null,
      p_filter_modalities: modalityArray && modalityArray.length > 0 ? modalityArray : null
    }));

        

        }

        else if (dateOptions.startsWith('custom:')) {
        const customDateStr = dateOptions.split('custom:')[1].trim();
        const customDate = new Date(customDateStr);
        const weekDay = weekdays[customDate.getDay()];
        const formattedDate = formatLocalDate(customDate);

        // 1. Initialize Query 1 (Recurring on this specific weekday)
        let query1 = supabaseAdmin
          .from('sessions_with_coords')
          .select('id, lat, lng')
          .eq('validated', true)
          .eq('dayOfWeek', weekDay);

        // 2. Initialize Query 2 (Specific date match)
        let query2 = supabaseAdmin
          .from('sessions_with_coords')
          .select('id, lat, lng')
          .eq('validated', true)
          .overlaps('dates', [formattedDate]);

        // 3. Apply Styles filter to BOTH
        if (Array.isArray(stylesParam) && stylesParam.length > 0) {
          query1 = query1.overlaps('styles', stylesParam);
          query2 = query2.overlaps('styles', stylesParam);
        }

        // 4. Apply Modality filter to BOTH
        if (Array.isArray(modalityParam) && modalityParam.length > 0) {
          query1 = query1.in('modality', modalityParam);
          query2 = query2.in('modality', modalityParam);
        }

        // Execute both queries in parallel
        const [res1, res2] = await Promise.all([query1, query2]);

        dataMarkers = [...(res1.data || []), ...(res2.data || [])];
        error = res1.error || res2.error;
      }

      else {
        // "Don't send incomplete info heh"
        throw new Error(`Invalid or missing dateOptions`);
    }









    if (error) {
      console.error('Supabase RPC Error:', error.message);
      throw error;
    }
  
    

    return NextResponse.json(dataMarkers);
    

  } catch (error: any) {
    console.error('getHomeCards failure:', error.message);
    return null;
  }
};