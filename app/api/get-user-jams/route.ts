import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Fetch profile by email
  const { data: dataProfiles, error: errorProfiles } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', session.user.email)
    .single(); // expect one profile

  if (errorProfiles || !dataProfiles) {
    return NextResponse.json(
      { error: errorProfiles?.message || 'Profile not found' },
      { status: 404 },
    );
  }

  // Fetch jams where host_id = profile id
  const { data, error } = await supabaseAdmin
    .from('sessions')
    .select('id, jam_title, location_address, images')
    .eq('host_id', dataProfiles.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = data?.map((j) => ({
    id: j.id,
    jam_title: j.jam_title,
    location_address: j.location_address,
    image: j.images?.[0] || null,
  }));

  return NextResponse.json(formatted);
}
