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

    const isDev = process.env.NODE_ENV === 'development';

    // Jobs channel: postgres_changes on public.jobs
    const jobsChannel = supabase
      .channel('public:jobs', { config: { broadcast: { ack: true }, presence: { key: 'jobs-list' } } })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          if (isDev) {
            console.debug('[Realtime] jobs change', {
              type: payload.eventType,
              new: payload.new,
              old: payload.old,
            });
          }
          if (handlersRef.current.onJobUpsert) {
            handlersRef.current.onJobUpsert(payload);
          }
        }
      )
      .subscribe((status) => {
        if (isDev) {
          console.log('[Realtime] Jobs channel status:', status);
        }
      });

    // Notifications: broadcast channel "public:notifications", event "new_notification"
    const notifChannel = supabase
      .channel('public:notifications', { config: { broadcast: { ack: true } } })
      .on(
        'broadcast',
        { event: 'new_notification' },
        (payload) => {
          if (isDev) {
            console.debug('[Realtime] notification broadcast', payload);
          }
          if (handlersRef.current.onNotification) {
            handlersRef.current.onNotification(payload?.payload ?? payload);
          }
        }
      )
      .subscribe((status) => {
        if (isDev) {
          console.log('[Realtime] Notifications channel status:', status);
        }
      });

    // Global socket state logs (help diagnose websocket/CORS)
    try {
      const rt = supabase?.realtime;
      if (rt && isDev) {
        rt.onOpen(() => console.log('[Realtime] socket open'));
        rt.onClose(() => console.warn('[Realtime] socket closed'));
        rt.onError((e) => console.error('[Realtime] socket error', e));
      }
    } catch (e) {
      // ignore
    }

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
