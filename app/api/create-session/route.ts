
import { supabase } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {






  const body = await req.json();
  console.log('POST hit!', body);
  


  // get server session
  const session = await getServerSession(authOptions); // App Router uses new form
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;

  // get host_id from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const { title, location, latitude, longitude } = body;

  const { data, error } = await supabase.from('sessions').insert([
    {
      title,
      location,
      latitude,
      longitude,
      host_id: profile.id,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
