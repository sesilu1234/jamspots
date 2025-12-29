import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { searchParams } = new URL(req.url);

  // Parámetros
  const userDate = searchParams.get('userDate')!;
  const { slug } = await context.params; // aquí unwrap de la promesa
  console.log('slug:', slug);
  console.log(userDate, 'date');

  const { data, error } = await supabaseAdmin
    .from('sessions_with_coords')
    .select(
      `
    jam_title,
    styles,
    drums,
    lista_canciones,
    instruments_lend,
    location_title,
    location_address,
    lat,
    lng,
    description,
    time_start,
    images,
    social_links,
    periodicity,
    dates,
    dayOfWeek
  `,
    )
    .eq('slug', slug)
    .maybeSingle();

  let nextDate: Date | null = null;

  if (data.periodicity === 'manual') {
    nextDate =
      data.dates
        .map((d: string) => new Date(d))
        .filter((d) => d > new Date(userDate))
        .sort((a, b) => +a - +b)[0] ?? null;
  }

  if (data.periodicity === 'weekly') {
    for (let i = 0; i <= 6; i++) {
      const d = new Date(user);
      d.setDate(d.getDate() + i);
      if (d.getDay() === data.dayOfWeek) {
        nextDate = d;
        break;
      }
    }
  }

  console.log(data);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
