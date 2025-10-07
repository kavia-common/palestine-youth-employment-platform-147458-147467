import React, { useEffect, useState } from 'react';
import useRealtime from '../../hooks/useRealtime';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * NotificationCenter - shows latest notifications from realtime channel
 */
export default function NotificationCenter() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  useRealtime({
    onNotification: (notif) => {
      setItems(prev => [{ id: Date.now(), ...notif }, ...prev].slice(0, 5));
    }
  });

  useEffect(() => {
    // Placeholder: could fetch initial notifications from API later
  }, []);

  return (
    <div className="ocean-card" style={{padding:8}}>
      <span aria-label={t('app.notifications')} role="status">🔔 {items.length}</span>
    </div>
  );
}
