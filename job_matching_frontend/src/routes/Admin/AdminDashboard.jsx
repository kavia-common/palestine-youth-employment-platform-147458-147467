import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * AdminDashboard - stub page
 */
export default function AdminDashboard() {
  const { t } = useTranslation();
  return (
    <section className="ocean-card" style={{padding:16}}>
      <h2 style={{marginTop:0}}>{t('app.admin')}</h2>
      <p>Review analytics and manage platform settings.</p>
    </section>
  );
}
