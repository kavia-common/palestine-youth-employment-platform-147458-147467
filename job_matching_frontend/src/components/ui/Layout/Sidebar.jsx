import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

/**
 * PUBLIC_INTERFACE
 * Sidebar - Navigation sidebar
 */
export default function Sidebar({ currentPath }) {
  const { t } = useTranslation();

  const linkClass = ({ isActive }) =>
    classNames('btn', {
      'btn-primary': isActive,
    });

  return (
    <aside className="ocean-sidebar" aria-label="Sidebar">
      <h1 style={{fontSize:18, marginTop:0, marginBottom:16}}>{t('app.title')}</h1>
      <nav aria-label="Primary">
        <ul className="list" role="list">
          <li className="list-item" style={{borderBottom:'none', padding:0, marginBottom:8}}>
            <NavLink to="/" className={linkClass} aria-current={currentPath === '/' ? 'page' : undefined}>
              {t('app.dashboard')}
            </NavLink>
          </li>
          <li className="list-item" style={{borderBottom:'none', padding:0, marginBottom:8}}>
            <NavLink to="/jobs" className={linkClass}>
              {t('app.jobs')}
            </NavLink>
          </li>
          <li className="list-item" style={{borderBottom:'none', padding:0, marginBottom:8}}>
            <NavLink to="/employer" className={linkClass}>
              {t('app.employer')}
            </NavLink>
          </li>
          <li className="list-item" style={{borderBottom:'none', padding:0}}>
            <NavLink to="/admin" className={linkClass}>
              {t('app.admin')}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
