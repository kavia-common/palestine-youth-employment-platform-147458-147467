import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * Returns a singleton Supabase client configured via environment variables.
 * Required env:
 *  - REACT_APP_SUPABASE_URL
 *  - REACT_APP_SUPABASE_ANON_KEY
 *
 * Notes:
 * - Ensure Realtime is enabled on your Supabase project and that the publication includes the required tables (e.g., public.jobs, public.notifications).
 * - For broadcast events, backend emitters should target the same channel name used here ("public:notifications").
 */
let supabase = null;

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Create or return the Supabase client. In development, emits diagnostic logs for easier realtime troubleshooting.
 */
export function getSupabaseClient() {
  if (supabase) return supabase;

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn(
      'Supabase env variables are missing. Realtime features will be disabled. ' +
      'Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env'
    );
    return null;
  }

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.info('[Supabase] Initializing client', {
      url_preview: url ? url.replace(/(https?:\/\/)(.{3}).+?(\.supabase\.co)/, '$1$2***$3') : null,
      anon_key_prefix: key ? `${key.slice(0, 6)}...` : null
    });
  }

  supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      // Developer-friendly rate and logging
      params: { eventsPerSecond: 10 }
    },
    global: {
      fetch: (...args) => fetch(...args),
    },
    // Supabase-js v2 exposes debug via global log level; we will log manually in subscribers
  });

  return supabase;
}
