import { createClient } from '@supabase/supabase-js';

// Server-side only: use service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!; // server-only

console.log(supabaseUrl,supabaseServiceKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
