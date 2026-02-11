import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DateTime } from 'luxon';

export async function GET(request: NextRequest) {
  try {
    // Basic test return to prove the route works
    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}