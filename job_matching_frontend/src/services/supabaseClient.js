import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * Returns a singleton Supabase client configured via environment variables.
 * Required env:
 *  - REACT_APP_SUPABASE_URL
 *  - REACT_APP_SUPABASE_ANON_KEY
 */
let supabase = null;

export function getSupabaseClient() {
  if (supabase) return supabase;

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Supabase env variables are missing. Realtime features will be disabled.');
    // Create a stub client-like object to prevent runtime crashes if needed
    return null;
  }

  supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: { eventsPerSecond: 10 }
    }
  });

  return supabase;
}
