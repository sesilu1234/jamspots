import 'server-only';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { cache } from 'react';
import { DateTime } from 'luxon';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

import { Jam } from '../types/jam';

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
  periodicity: string;
  dayOfWeek: string;
    created_at: string;


dates: string[];
 location_coords: string;
  host_id: string;
   time_start: string;
    f_next_date: string;


};

export const getJam = cache(async (slug: string) => {


  const session = await getServerSession(authOptions); // App Router uses new form
  
     
  
  const userEmail = session?.user.email || null;
  
  
  const [jamResponse, commentsResponse] = await Promise.all([
    supabaseAdmin.rpc('get_jam_by_slug', { p_slug: slug }).maybeSingle(),
    supabaseAdmin.rpc('get_comments_for_jam', { p_jam_slug: slug, p_email: userEmail })
  ]);

  const { data: jamData, error: jamError } = jamResponse;
  const { data: commentsData, error: commentsError } = commentsResponse;

  if (jamError || commentsError) {
    console.error('Data Fetch Error:', { jamError, commentsError });
    return null; 
  }

const formattedComments = (commentsData || []).map((comment: any) => {
  // 1. Force the locale to English ('en')
  const createdDate = DateTime.fromISO(comment.created_at).setLocale('en');
  
  // 2. Generate the relative time (e.g., "5 minutes ago")
  const timeSince = createdDate.toRelative() || 'just now';

  // 3. Apply the same logic to replies
  const safeReplies = (comment.replies ?? []).map((reply: any) => ({
    ...reply,
    replies: reply.replies ?? [],
    time: DateTime.fromISO(reply.created_at).setLocale('en').toRelative() || 'just now'
  }));

  return {
    ...comment,
    time: timeSince,
    replies: safeReplies,
  };
});

  console.log(formattedComments);

  // Cast through 'unknown' to safely tell TS this is our JamSessionResult
  const jam = jamData as unknown as JamSessionResult;

  if (!jam) return null;

  const localTime = (jam.next_date && jam.next_date_timezone)
    ? DateTime.fromISO(jam.next_date).setZone(jam.next_date_timezone)
    : null;


    

  return {
    ...jam,
    display_date: localTime && localTime.isValid
      ? localTime.toFormat('ccc d LLL, HH:mm') 
      : 'Date TBD',
       iso_date: localTime && localTime.isValid
    ? localTime.toISO() // for JSON-LD / Google
    : null,
     comments: formattedComments || [],
  };
});