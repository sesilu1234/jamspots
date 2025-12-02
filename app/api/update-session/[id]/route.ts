import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  console.log('Updating session with id:', id);

  const body = await req.json();

  console.log(body);

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

  const host_id = profile?.id;

  const { location_coords } = body;

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
        ...body,
        location_coords: pointValue,
      },
    ])
    .eq('id', id)
    .eq('host_id', host_id)
    .select()
    .maybeSingle(); // return the updated row

  if (error) {
    console.log('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data }, { status: 200 });
}
