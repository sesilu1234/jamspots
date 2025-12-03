import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';


export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params; // aquí unwrap de la promesa
  console.log('slug:', slug);

  const { data, error } = await supabaseAdmin
    .from('sessions_with_coords')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  console.log(data);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
