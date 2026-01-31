import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jam_id, reason, description } = body;

    // 1. Get server session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. BASIC VALIDATION
    if (!jam_id || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. LENGTH CHECKS (The "Anti-Spam" Guard)
    if (description && description.length > 500) {
      return NextResponse.json({ error: 'Description too long (max 500 chars)' }, { status: 400 });
    }

    if (reason.length > 50) { // Just in case someone tries to inject a huge string into the reason
      return NextResponse.json({ error: 'Invalid reason length' }, { status: 400 });
    }

    const userEmail = session.user.email;

   

    // 5. INSERT
    const { data, error } = await supabaseAdmin
      .from('jam_reports')
      .insert({
        jam_id,
        reason,
        description: description?.trim(), // Clean up whitespace
        reporter_email: userEmail
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}