import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * Dashboard - landing page
 */
export default function Dashboard() {
  const { t } = useTranslation();
  return (
    <section className="ocean-card" style={{padding:16}}>
      <h2 style={{marginTop:0}}>{t('app.dashboard')}</h2>
      <p>{t('jobs.updated_in_realtime')}</p>
    </section>
  );
}
