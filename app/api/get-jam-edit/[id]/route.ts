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
    .select('*')
    .eq('id', id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
