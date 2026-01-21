import { createClient } from '@supabase/supabase-js';

// TypeScript type annotation syntax: const name: type = value
const supabaseUrl: string = process.env.SUPABASE_URL!;
const supabaseAnonKey: string = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
