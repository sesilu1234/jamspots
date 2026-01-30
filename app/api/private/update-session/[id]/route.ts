import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { success, z } from 'zod';
import { validateJam } from './serverCheck';
import { uploadPhotos } from '@/lib/upload-photos';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const formData = await req.formData();

    const jamColumns = JSON.parse(formData.get('jamColumns') as string);
    const images_list = formData
      .getAll('images')
      .filter(
        (f): f is File =>
          f instanceof File && f.size > 0 && f.type.startsWith('image/'),
      );

    jamColumns.images_three = images_list.length == 3 ? true : false;

    const parsed_jamData = validateJam(jamColumns);
    if (!parsed_jamData.success) {
      return NextResponse.json(
        {
          error: "Data couldn't pass Zod",
          details: "Data couldn't pass Zod",
        },
        { status: 400 },
      );
    }

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

    const { location_coords } = jamColumns;

    // Handle geometry safely
    let pointValue: string | null = null;
    if (location_coords?.lat && location_coords?.lng) {
      const lat = parseFloat(location_coords.lat);
      const lng = parseFloat(location_coords.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        pointValue = `SRID=4326;POINT(${lng} ${lat})`;
      }
    }

    const { data: joins, error: authError } = await supabaseAdmin
      .from('profiles')
      .select('id, sessions!inner(id)')
      .eq('email', userEmail)
      .eq('sessions.id', id) // session id from params
      .single();

    if (authError || !joins) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: images, error: fetchError } = await supabaseAdmin
      .from('sessions')
      .select('images')
      .eq('id', id);

    if (fetchError) throw fetchError;

    // 2️⃣ Add folder prefix
    const imageNames = images[0].images.map(
      (path: string) => 'images/' + path.substring(path.lastIndexOf('/') + 1),
    );

    const { error: deleteErrorImages } = await supabaseAdmin.storage
      .from('jamspots_imageBucket')
      .remove(imageNames); // delete only this file

    if (deleteErrorImages) {
      return NextResponse.json(
        { error: deleteErrorImages.message },
        { status: 500 },
      );
    }

    const result = await uploadPhotos(images_list);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    jamColumns.images = result.urls;

    delete jamColumns['raw_desc'];
    delete jamColumns['images_three'];

    const { data, error } = await supabaseAdmin
      .from('sessions')
      .update([
        {
          ...jamColumns,
          location_coords: pointValue,
          validated:false,
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
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
