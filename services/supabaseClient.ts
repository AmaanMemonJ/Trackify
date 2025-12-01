import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = (url && anon) ? createClient(url, anon) : null;
