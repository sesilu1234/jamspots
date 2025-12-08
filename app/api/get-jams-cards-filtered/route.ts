import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  console.log('ew0ee9ew');
  console.log(searchParams);

  const userDate = searchParams.get('userDate');

  const dateOptions = searchParams.get('dateOptions');

  const order = searchParams.get('order') || 'popular';
  const lat = parseFloat(searchParams.get('lat') || '38.9848328');
  const lng = parseFloat(searchParams.get('lng') || '-77.09431719999999');
  const distance = parseFloat(searchParams.get('distance') || '20'); // km
  const styles = searchParams.get('styles')
    ? JSON.parse(searchParams.get('styles')!)
    : [];

  const today = new Date().toISOString();

  // Construct PostGIS filter for distance
  const locationFilter = `ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, ${distance * 1000})`;

  // Construct style filter if needed
  const styleFilter =
    styles.length > 0 ? `AND styles && '{${styles.join(',')}}'` : '';

  const sql = `
    SELECT id, jam_title, location_title, styles, location_address, dates, time_start, images, slug
    FROM sessions
    WHERE ${locationFilter} ${styleFilter}
  `;

  const { data, error } = await supabaseAdmin.rpc('execute_sql', { sql }); // if using RPC to run raw SQL
  // Or if you can use supabaseAdmin.from().select() with `.filter()` via raw SQL
  // Otherwise you can use `supabaseAdmin.from('sessions').select().gte(...)` for simpler filters

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const formatted = data
    ?.map((jam) => {
      const validDates = (jam.dates || []).filter(
        (d: string) => new Date(d) >= new Date(today),
      );
      if (validDates.length === 0) return null;

      const minDate = validDates.reduce((a: string, b: string) =>
        new Date(a) < new Date(b) ? a : b,
      );
      return {
        ...jam,
        dates: minDate,
        image: jam.images?.[0] || null,
      };
    })
    .filter(Boolean);

  return NextResponse.json(formatted);
}
