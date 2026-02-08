import 'server-only';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { cache } from 'react';
import { DateTime } from 'luxon';

type JamSessionResult = {
  id: string;
  slug: string;
  modality: string;
  jam_title: string;
  location_title: string;
  images: string[] | null;
  styles: string[] | null;
  drums: string | null;
  instruments_lend: string | null;
  lista_canciones: string | null;
  description: string | null;
  location_address: string | null;
  lat: number;
  lng: number;
  social_links: any;
  next_date: string | null;
  next_date_timezone: string | null;
};

export const getJam = cache(async (slug: string) => {
  const { data, error } = await supabaseAdmin
    .rpc('get_jam_by_slug', { p_slug: slug })
    .maybeSingle();

  if (error) {
    console.error('Supabase Error:', error.message);
    return null;
  }

  // Cast through 'unknown' to safely tell TS this is our JamSessionResult
  const jam = data as unknown as JamSessionResult;

  if (!jam) return null;

  const localTime = (jam.next_date && jam.next_date_timezone)
    ? DateTime.fromISO(jam.next_date).setZone(jam.next_date_timezone)
    : null;



  return {
    ...jam,
    display_date: localTime && localTime.isValid
      ? localTime.toFormat('ccc d LLL, HH:mm') 
      : 'Date TBD',
  };
});