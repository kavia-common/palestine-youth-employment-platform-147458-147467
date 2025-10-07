import { useEffect, useRef } from 'react';
import { getSupabaseClient } from '../services/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * useRealtime - Subscribe to Supabase realtime channels.
 * @param {Object} cfg - configuration
 * @param {function} cfg.onJobUpsert - callback for job insert/update
 * @param {function} cfg.onNotification - callback for notification events
 * @returns {void}
 */
export default function useRealtime({ onJobUpsert, onNotification } = {}) {
  const handlersRef = useRef({ onJobUpsert, onNotification });
  handlersRef.current = { onJobUpsert, onNotification };

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const jobsChannel = supabase
      .channel('public:jobs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          if (handlersRef.current.onJobUpsert) {
            handlersRef.current.onJobUpsert(payload);
          }
        }
      )
      .subscribe((status) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Jobs channel status:', status);
        }
      });

    const notifChannel = supabase
      .channel('public:notifications')
      .on(
        'broadcast',
        { event: 'new_notification' },
        (payload) => {
          if (handlersRef.current.onNotification) {
            handlersRef.current.onNotification(payload?.payload);
          }
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(jobsChannel);
        supabase.removeChannel(notifChannel);
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);
}
