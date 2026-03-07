// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Yeh 'supabase' variable hum poori app mein DB se baat karne ke liye use karenge
export const supabase = createClient(supabaseUrl, supabaseKey);