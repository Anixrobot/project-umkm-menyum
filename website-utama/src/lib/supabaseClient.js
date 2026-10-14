import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://suexxwtyqnuaktqbzprd.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZXh4d3R5cW51YWt0cWJ6cHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NTQ4NzYsImV4cCI6MjEwNzUzMDg3Nn0.nTDkuc4_UwyOiGOwzNL9XrLzVhfboZvS24844brGoS4';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;

