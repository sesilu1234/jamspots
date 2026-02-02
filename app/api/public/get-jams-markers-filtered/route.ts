import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const userDate = searchParams.get('userDate'); // "2025-12-09"
    const dateOptions = searchParams.get('dateOptions'); // "all", "week", "custom: 2025-12-21"
    const safeParse = (param: any) => {
  if (typeof param !== 'string') return [];
  try {
    const parsed = JSON.parse(param);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
};

const stylesParam = safeParse(searchParams.get('styles'));
const modalityParam = safeParse(searchParams.get('modality'));

   

    const formatLocalDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate(),
      ).padStart(2, '0')}`;

    // Date filtering
    let data, error;

    if (dateOptions && userDate) {



      if (dateOptions === 'all') {

        
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

console.log(stylesParam,typeof stylesParam);
  ({ data, error } = await query);





      } else if (dateOptions === 'week') {
  const startDate = new Date(userDate);
  const endDate = new Date(userDate);
  endDate.setDate(endDate.getDate() + 7);

  const rangeDates: string[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    rangeDates.push(formatLocalDate(new Date(d)));
  }

  // Define your base queries
  let query1 = supabaseAdmin
    .from('sessions_with_coords')
    .select('id, lat, lng')
    .eq('validated', true)
    .eq('periodicity', 'weekly'); // .filter('periodicity', 'eq', 'weekly') can be simplified to .eq()

  let query2 = supabaseAdmin
    .from('sessions_with_coords')
    .select('id, lat, lng')
    .eq('validated', true)
    .overlaps('dates', rangeDates);

  // Apply Styles filter to BOTH queries
  if (Array.isArray(stylesParam) && stylesParam.length > 0) {
    query1 = query1.overlaps('styles', stylesParam);
    query2 = query2.overlaps('styles', stylesParam);
  }

  // Apply Modality filter to BOTH queries
  if (Array.isArray(modalityParam) && modalityParam.length > 0) {
    query1 = query1.in('modality', modalityParam);
    query2 = query2.in('modality', modalityParam);
  }

  const [res1, res2] = await Promise.all([query1, query2]);

  data = [...(res1.data || []), ...(res2.data || [])];
  error = res1.error || res2.error;
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

  data = [...(res1.data || []), ...(res2.data || [])];
  error = res1.error || res2.error;
}
    }

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
