import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Membersihkan URL jika ada trailing slash atau /rest/v1
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Perhatian: VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum terpasang dengan benar di .env!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;

