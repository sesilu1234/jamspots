import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    // Run both queries simultaneously
    const [countResult, userLikeResult] = await Promise.all([
      // 1. Total Count Query
      supabaseAdmin
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('jam_id', id),

      // 2. Personal Like Status (only if session exists)
      userEmail
        ? supabaseAdmin
            .from('likes')
            .select('email')
            .eq('jam_id', id)
            .eq('email', userEmail)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

    // Error handling for either query
    if (countResult.error) throw countResult.error;
    if (userLikeResult.error) throw userLikeResult.error;

    return NextResponse.json({
      count: countResult.count ?? 0,
      hasLiked: !!userLikeResult.data, // Converts the object (or null) to a boolean
    });
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
