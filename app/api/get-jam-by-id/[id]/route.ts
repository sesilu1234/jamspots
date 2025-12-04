import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params; // aquí unwrap de la promesa
  console.log('id:', id);

  const { data, error } = await supabaseAdmin
    .from('sessions')
    .select('jam_title, location_title, location_address, images, styles, slug')
    .eq('id', id)
    .maybeSingle();

  const result = data ? { ...data, images: data.images?.[0] ?? null } : null;

  console.log('dddd');
  console.log(result);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(result);
}
