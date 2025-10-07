import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * Register page stub
 */
export default function Register() {
  const { t } = useTranslation();
  return (
    <section className="ocean-card" style={{padding:16, maxWidth:420, margin:'40px auto'}}>
      <h2 style={{marginTop:0}}>{t('app.register')}</h2>
      <form onSubmit={(e)=>e.preventDefault()} noValidate>
        <label htmlFor="email">{t('auth.email')}</label>
        <input id="email" name="email" type="email" className="input" aria-required="true" />

        <div style={{height:10}} />
        <label htmlFor="password">{t('auth.password')}</label>
        <input id="password" name="password" type="password" className="input" aria-required="true" />

        <div style={{height:10}} />
        <label htmlFor="confirm_password">{t('auth.confirm_password')}</label>
        <input id="confirm_password" name="confirm_password" type="password" className="input" aria-required="true" />

        <div style={{height:16}} />
        <button className="btn btn-primary" type="submit">{t('app.register')}</button>
      </form>
      <div style={{marginTop:12, color:'var(--color-muted)'}}>
        {t('auth.have_account')} <Link to="/auth/login">{t('app.login')}</Link>
      </div>
    </section>
  );
}
