import type { NextApiRequest, NextApiResponse } from 'next';

import { supabase } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './route';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).end();

  const userEmail = session.user.email;

  // optionally get host_id from your profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const { title, location, latitude, longitude } = req.body;

  const { data, error } = await supabase.from('sessions').insert([
    {
      title,
      location,
      latitude,
      longitude,
      host_id: profile.id,
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}
