// app/sitemap.xml/route.ts
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch slugs from Supabase
    const { data: jams, error } = await supabaseAdmin
      .from('sessions')
      .select('slug');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const urls = jams.map((j) => `https://jampspots.xyz/jam/${j.slug}`);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://jampspots.xyz/</loc></url>
  ${urls.map((url) => `<url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
