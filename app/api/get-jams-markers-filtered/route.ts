import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
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
  const stylesParam = searchParams.get('styles'); // '["Blues","Hip-Hop"]'

  // Helper para formatear fecha local YYYY-MM-DD
  const formatLocalDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Date filtering
  let data, error;

  if (dateOptions && userDate) {
    if (dateOptions === 'all') {
      ({ data, error } = await supabaseAdmin
        .from('sessions_with_coords')
        .select('id, lat, lng'));
    } else if (dateOptions === 'week') {
      const startDate = new Date(userDate);
      const endDate = new Date(userDate);
      endDate.setDate(endDate.getDate() + 7);

      const rangeDates: string[] = [];
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        rangeDates.push(formatLocalDate(new Date(d)));
      }

      const [res1, res2] = await Promise.all([
        supabaseAdmin
          .from('sessions_with_coords')
          .select('id, lat, lng')
          .filter('periodicity', 'eq', 'weekly'),
        supabaseAdmin
          .from('sessions_with_coords')
          .select('id, lat, lng')
          .overlaps('dates', rangeDates),
      ]);

      data = [...(res1.data || []), ...(res2.data || [])];
      error = res1.error || res2.error;
    } else if (dateOptions.startsWith('custom:')) {
      const customDateStr = dateOptions.split('custom:')[1].trim();
      const customDate = new Date(customDateStr);
      const weekDay = weekdays[customDate.getDay()];

      const [res1, res2] = await Promise.all([
        supabaseAdmin
          .from('sessions_with_coords')
          .select('id, lat, lng')
          .filter('dayOfWeek', 'eq', weekDay),
        supabaseAdmin
          .from('sessions_with_coords')
          .select('id, lat, lng')
          .overlaps('dates', [formatLocalDate(customDate)]),
      ]);

      data = [...(res1.data || []), ...(res2.data || [])];
      error = res1.error || res2.error;
    }
  }

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
