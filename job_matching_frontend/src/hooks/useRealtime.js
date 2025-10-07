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

    // Log boot summary for easier troubleshooting of envs and realtime
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log('[Realtime] Boot', {
        supabase_url_set: !!process.env.REACT_APP_SUPABASE_URL,
        supabase_key_set: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
      });
    }

    // Jobs channel: postgres_changes on public.jobs (requires Realtime enabled on table/publication)
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
          if (status === 'SUBSCRIBED') {
            console.log('[Realtime] Subscribed to postgres_changes on public.jobs. Ensure DB publication includes this table and RLS policies allow changes to be streamed.');
          }
        }
      });

    // Notifications: Prefer broadcast event "new_notification" on channel "public:notifications".
    // If not receiving, fallback to postgres_changes on public.notifications (insert-only) to cover DB-driven notifications.
    let notifChannel = supabase
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
          console.log('[Realtime] Notifications broadcast channel status:', status);
        }
      });

    // After a small grace period, if there have been no broadcasts, attach a postgres_changes fallback.
    // Note: This does not disable broadcast; both may coexist safely.
    const fallbackTimer = setTimeout(() => {
      try {
        // Attach postgres_changes to the SAME channel name for consistency
        notifChannel = supabase
          .channel('public:notifications', { config: { broadcast: { ack: true } } })
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'notifications' },
            (payload) => {
              if (isDev) {
                console.debug('[Realtime] notifications row insert (fallback)', payload);
              }
              const notif = payload?.new || payload?.record || payload;
              if (handlersRef.current.onNotification && notif) {
                handlersRef.current.onNotification(notif);
              }
            }
          )
          .subscribe((status) => {
            if (isDev) {
              console.log('[Realtime] Notifications postgres_changes fallback status:', status);
              if (status === 'SUBSCRIBED') {
                console.log('[Realtime] Using notifications table fallback via postgres_changes. Ensure table is added to Realtime publication and RLS allows visibility to anon (or use JWT with appropriate policies).');
              }
            }
          });
      } catch (e) {
        if (isDev) console.warn('[Realtime] Failed to attach notifications postgres_changes fallback', e);
      }
    }, 1500);

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
        clearTimeout(fallbackTimer);
      } catch (e) {
        // ignore
      }
      try {
        supabase.removeChannel(jobsChannel);
      } catch (e) {
        // ignore
      }
      try {
        supabase.removeChannel(notifChannel);
      } catch (e) {
        // ignore
      }
    };
  }, []);
}
