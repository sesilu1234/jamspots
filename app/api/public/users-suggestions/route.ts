import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { msg, email } = body;

    const sender_ip = req.headers.get('x-forwarded-for')?.split(',')[0] || null;
    const user_agent = req.headers.get('user-agent') || null;

    console.log(msg, email, sender_ip, user_agent);

    const { data, error } = await supabaseAdmin
      .from('user_suggestions')
      .insert({ 
        sender_email: email, 
        message: msg, 
        sender_ip, 
        user_agent 
      })
      .select()
      .maybeSingle();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
