import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme/ocean.css';
import './App.css';
import './i18n/i18n';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/ui/Layout/AppLayout';
import Dashboard from './routes/Dashboard';
import JobsList from './routes/Jobs/JobsList';
import JobDetail from './routes/Jobs/JobDetail';
import EmployerDashboard from './routes/Employer/EmployerDashboard';
import AdminDashboard from './routes/Admin/AdminDashboard';
import Login from './routes/Auth/Login';
import Register from './routes/Auth/Register';

if (process.env.NODE_ENV === 'development') {
  // Log a safe preview of env config to help validate wiring
  const safe = (v) => (typeof v === 'string' && v.length > 8 ? `${v.slice(0, 8)}...` : v);
  // eslint-disable-next-line no-console
  console.log('[Boot] ENV summary', {
    API_BASE: process.env.REACT_APP_API_BASE_URL || '(not set)',
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || '(not set)',
    SUPABASE_ANON_KEY: safe(process.env.REACT_APP_SUPABASE_ANON_KEY || '(not set)'),
    origin: window.location.origin
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
