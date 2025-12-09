import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {

    const { data, error } = await supabaseAdmin
    .from('sessions')
    .select(
      'id, jam_title, location_title, styles, location_address, dates, time_start, images, slug',
    );




  const dataRes = data
    ?.map((jam) => {
      

      return {
        ...jam,
        image: jam.images?.[0] || null, // first image
      };
    })
    .filter(Boolean); // remove nulls


if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

 return NextResponse.json(dataRes);
}
