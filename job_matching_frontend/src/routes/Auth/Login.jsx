import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * Login page stub
 */
export default function Login() {
  const { t } = useTranslation();
  return (
    <section className="ocean-card" style={{padding:16, maxWidth:420, margin:'40px auto'}}>
      <h2 style={{marginTop:0}}>{t('app.login')}</h2>
      <form onSubmit={(e)=>e.preventDefault()} noValidate>
        <label htmlFor="email">{t('auth.email')}</label>
        <input id="email" name="email" type="email" className="input" aria-required="true" />

        <div style={{height:10}} />
        <label htmlFor="password">{t('auth.password')}</label>
        <input id="password" name="password" type="password" className="input" aria-required="true" />

        <div style={{height:16}} />
        <button className="btn btn-primary" type="submit">{t('app.login')}</button>
      </form>
      <div style={{marginTop:12, color:'var(--color-muted)'}}>
        {t('auth.no_account')} <Link to="/auth/register">{t('app.register')}</Link>
      </div>
    </section>
  );
}
