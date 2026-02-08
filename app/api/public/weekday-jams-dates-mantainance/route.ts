import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';



// 1. Define the shape of our Jam object for TS
type JamSession = {
  id: any;
  dayOfWeek: any;
  time_start: any;
  lng: any;
  lat: any;
  timezone?: string;
};

const weekdayMap = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
} as const;

export async function POST(req: Request) {
  try {
    // --- SECURITY: Vercel Cron Secret Check ---
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    // 2. Fetch all weekly sessions
    const { data: weeklyJams, error: profileError } = await supabaseAdmin
      .from('sessions_with_coords')
      .select('id, dayOfWeek, time_start, lng, lat, timezone')
      .eq('periodicity', 'weekly');

    if (profileError) throw profileError;
    if (!weeklyJams)
      return NextResponse.json({ success: true, message: 'No jams found' });

    // 3. Define the calculation logic
    const getWeeklyDatesUTC = (jam: JamSession): string[] => {
      const schedule: string[] = [];
      const now = DateTime.now().setZone(jam.timezone);

      const dayKey = jam.dayOfWeek.toLowerCase() as keyof typeof weekdayMap;
      const targetDayNumber = weekdayMap[dayKey] || 1;

      let currentPointer;

      if (now.weekday <= targetDayNumber) {
        currentPointer = now.set({ weekday: targetDayNumber });
      } else {
        currentPointer = now
          .plus({ weeks: 1 })
          .set({ weekday: targetDayNumber });
      }

      // Loop exactly 15 times
      while (schedule.length < 15) {
        const dateStr = currentPointer.toISODate();
        const eventTime = DateTime.fromISO(`${dateStr}T${jam.time_start}`, {
          zone: jam.timezone,
        });

        if (eventTime >= now) {
          schedule.push(eventTime.toUTC().toISO()!);
        }
        currentPointer = currentPointer.plus({ weeks: 1 });
      }
      return schedule;
    };

    // 4. Loop through sessions and update (Corrected loop syntax)
    for (const weeklyJam of weeklyJams) {
     

      const formattedDates = getWeeklyDatesUTC(weeklyJam).map((utcString) => ({
        utc_datetime: utcString,
        jam_timezone: weeklyJam.timezone,
      }));

      const { error: jamDatesError } = await supabaseAdmin.rpc(
        'sync_jam_dates_weekly',
        {
          target_jam_id: weeklyJam.id,
          new_dates: formattedDates,
        },
      );

      if (jamDatesError) {
        console.error(`Error updating jam ${weeklyJam.id}:`, jamDatesError);
        // Continue to next jam even if one fails
      } else {
        console.log(`Updated jam: ${weeklyJam.id}:`);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e: any) {
    console.error('Server error:', e);
    return NextResponse.json(
      { error: e.message || 'Server error' },
      { status: 500 },
    );
  }
}
