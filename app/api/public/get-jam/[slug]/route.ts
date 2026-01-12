import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { searchParams } = new URL(req.url);
  const userDate = searchParams.get('userDate')!;
  const { slug } = await context.params;
  console.log(userDate);
  console.log(slug);

  const { data, error } = await supabaseAdmin.rpc('run_jam_query', {
    p_slug: slug,
    p_date: userDate,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
