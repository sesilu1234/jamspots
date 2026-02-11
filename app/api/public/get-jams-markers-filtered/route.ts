
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DateTime } from 'luxon';

import { NextResponse } from 'next/server';



    export async function GET(req: Request) {
  try {
    
    

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    

  } catch (error: any) {
  console.error('getHomeMarkers failure:', error.message);
  return NextResponse.json(
    { error: 'Failed to fetch jams', details: error.message },
    { status: 500 }
  );
}
}