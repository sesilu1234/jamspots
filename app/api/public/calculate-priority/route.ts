import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Authorization Check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Call the RPC (the SQL function we just created)
    const { error } = await supabaseAdmin.rpc('update_session_priority_score');

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Priorities updated successfully via RPC' 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}