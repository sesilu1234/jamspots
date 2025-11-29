import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { jamSchema } from './zoddeCheck';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('POST hit!', body);

  const parsed_jamData = jamSchema.safeParse(body);

  if (!parsed_jamData.success) {
    return NextResponse.json(
      {
        error: "Data couldn't pass Zod",
        details: parsed_jamData.error.format(),
      },
      { status: 400 },
    );
  }

  // get server session
  const session = await getServerSession(authOptions); // App Router uses new form

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;

  // get host_id from profiles table
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

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

  const lat = parseFloat(location_coords.lat);
  const lng = parseFloat(location_coords.lng);

  const pointValue =
    !isNaN(lat) && !isNaN(lng) ? `SRID=4326;POINT(${lng} ${lat})` : null;

  const { data, error } = await supabaseAdmin.from('sessions').insert([
    {
      jam_title: jam_title, // maps jam_title → jamTitle
      location_title: location_title,
      periodicity: periodicity,
      dayOfWeek: dayOfWeek,
      dates: dates,
      time_start: time_start,
      images: images,
      styles: styles,
      lista_canciones: lista_canciones,
      instruments_lend: instruments_lend,
      drums: drums,
      description: description,
      social_links: social_links,
      host_id: profile.id,
      location_coords: pointValue,

      location_address: location_address,
    },
  ]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
