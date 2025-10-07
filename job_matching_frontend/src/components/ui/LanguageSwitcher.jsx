import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * LanguageSwitcher - Toggle language between EN/AR
 */
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage || 'en';
  const toggle = () => {
    const next = current === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };
  return (
    <button className="btn" onClick={toggle} aria-label={`${t('app.language')}: ${current.toUpperCase()}`}>
      {current === 'ar' ? 'EN' : 'AR'}
    </button>
  );
}
