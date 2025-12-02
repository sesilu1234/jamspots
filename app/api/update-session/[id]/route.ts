import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log('Updating session with id:', id);

  const body = await req.json();

  const {
    jam_title,
    location_title,
    location_address,
    periodicity,
    dayOfWeek,
    dates,
    time_start,
    images,
    styles,
    lista_canciones,
    instruments_lend,
    drums,
    description,
    social_links,
    location_coords,
  } = body;

  // Handle geometry safely
  let pointValue: string | null = null;
  if (location_coords?.lat && location_coords?.lng) {
    const lat = parseFloat(location_coords.lat);
    const lng = parseFloat(location_coords.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      pointValue = `SRID=4326;POINT(${lng} ${lat})`;
    }
  }

  const { data, error } = await supabaseAdmin
    .from('sessions')
    .update([
      {
        jam_title,
        location_title,
        location_address,
        periodicity,
        dayOfWeek,
        dates,
        time_start,
        images,
        styles,
        lista_canciones,
        instruments_lend,
        drums,
        description,
        social_links,
        location_coords: pointValue,
      },
    ])
    .eq('id', id)
    .select()
    .maybeSingle(); // return the updated row

  if (error) {
    console.log('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data }, { status: 200 });
}
