import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../../../theme/ocean.css'; // corrected path to theme
import '../../../App.css';

/**
 * PUBLIC_INTERFACE
 * AppLayout - Shell layout with sidebar and topbar.
 */
export default function AppLayout() {
  const location = useLocation();
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="ocean-app" role="application" aria-label="App Shell">
      <Sidebar currentPath={location.pathname} />
      <main style={{display:'flex', flexDirection:'column'}}>
        <Topbar theme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
        <div className="ocean-content" role="main">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
