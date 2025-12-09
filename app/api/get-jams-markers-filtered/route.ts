import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {



  const { searchParams } = new URL(req.url);



  const userDate = searchParams.get('userDate'); // "2025-12-09"
  const dateOptions = searchParams.get('dateOptions'); // "all", "week", "custom: 2025-12-21"
  const stylesParam = searchParams.get('styles'); // '["Blues","Hip-Hop"]'

  let query = supabaseAdmin.from('sessions_with_coords').select('id, lat, lng');

  // Helper para formatear fecha local YYYY-MM-DD
  const formatLocalDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Date filtering
if (dateOptions && dateOptions !== 'all' && userDate) {
  const startDate = new Date(userDate);
  const endDate = new Date(userDate);

  if (dateOptions === 'week') {
    endDate.setDate(endDate.getDate() + 7);

    const rangeDates: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      rangeDates.push(formatLocalDate(new Date(d)));
    }

    query = query.overlaps('dates', rangeDates);
    
  } else if (dateOptions.startsWith('custom:')) {
    const customDate = dateOptions.split('custom:')[1].trim();
    query = query.overlaps('dates', [customDate]);
   
  }
}


  // Styles filtering (at least one match)
  if (stylesParam) {
    try {
      const styles = JSON.parse(stylesParam);
      if (Array.isArray(styles) && styles.length > 0) {
        query = query.overlaps('styles', styles);
      }
    } catch (e) {
      console.warn('Invalid styles param', e);
    }
  }
  


  const { data, error } = await query;


  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
