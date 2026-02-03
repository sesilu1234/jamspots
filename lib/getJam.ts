import 'server-only';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { cache } from 'react';

export const getJam = cache(async (slug: string) => {



  const { data, error } = await supabaseAdmin
    .from('sessions')
    .select('*')
    .eq('slug', slug)
    .single(); // Use .single() if slug is unique to get an object instead of an array


 
  if (error) {
    console.error('Supabase Error:', error.message);
    return null;
  }

  return data;
});