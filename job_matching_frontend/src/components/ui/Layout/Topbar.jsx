import React from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import NotificationCenter from '../NotificationCenter';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * Topbar - header with controls
 */
export default function Topbar({ theme, onToggleTheme }) {
  const { t } = useTranslation();
  return (
    <header className="ocean-topbar">
      <div aria-live="polite" aria-atomic="true">
        <strong>{t('app.welcome')}</strong>
      </div>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <button
          className="btn"
          onClick={onToggleTheme}
          aria-label={`${t('app.theme')}: ${theme === 'light' ? t('app.dark') : t('app.light')}`}
        >
          {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? t('app.dark') : t('app.light')}
        </button>
        <LanguageSwitcher />
        <NotificationCenter />
      </div>
    </header>
  );
}
