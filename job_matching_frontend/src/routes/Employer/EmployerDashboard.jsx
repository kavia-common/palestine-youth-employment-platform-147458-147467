import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * EmployerDashboard - stub page
 */
export default function EmployerDashboard() {
  const { t } = useTranslation();
  return (
    <section className="ocean-card" style={{padding:16}}>
      <h2 style={{marginTop:0}}>{t('app.employer')}</h2>
      <p>Post and manage your job listings here.</p>
    </section>
  );
}
