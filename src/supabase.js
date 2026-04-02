// src/supabase.js
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!");
}

// Initialize the Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);