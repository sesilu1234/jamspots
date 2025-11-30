import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('sessions')
    .select(
      'id, jam_title, location_title, styles, location_address, dates, time_start, images',
    );

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const today = new Date();

  const formatted = data
    ?.map((jam) => {
      // Filter dates >= today
      const validDates = (jam.dates || []).filter(
        (d: string) => new Date(d) >= today,
      );

      if (validDates.length === 0) return null; // skip if no future date

      // pick min date
      const minDate = validDates.reduce((a: string, b: string) =>
        new Date(a) < new Date(b) ? a : b,
      );

      return {
        ...jam,
        dates: minDate, // keep original key
        image: jam.images?.[0] || null, // first image
      };
    })
    .filter(Boolean); // remove nulls

  return NextResponse.json(formatted);
}
