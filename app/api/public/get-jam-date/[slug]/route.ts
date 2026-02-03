import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {

  try {
  const { searchParams } = new URL(req.url);
  const userDate = searchParams.get('userDate')!;
  const { slug } = await context.params;

  const { data, error } = await supabaseAdmin.rpc('run_jam_query_fetch_date', {
    p_slug: slug,
    p_date: userDate,
  });

  console.log(error);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
     } catch (e) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
