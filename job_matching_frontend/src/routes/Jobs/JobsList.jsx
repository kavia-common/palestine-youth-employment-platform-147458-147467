import React, { useEffect, useState } from 'react';
import { JobsAPI } from '../../services/apiClient';
import { Link } from 'react-router-dom';
import useRealtime from '../../hooks/useRealtime';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * JobsList - Displays jobs with realtime updates via Supabase
 */
export default function JobsList() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  // initial load
  useEffect(() => {
    let mounted = true;
    JobsAPI.list()
      .then((data) => {
        if (!mounted) return;
        const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
        setJobs(items);
      })
      .catch((e) => setError(e.message));
    return () => { mounted = false; };
  }, []);

  // realtime updates: insert/update/delete
  useRealtime({
    onJobUpsert: (payload) => {
      setJobs((prev) => {
        if (payload.eventType === 'DELETE') {
          return prev.filter(j => j.id !== payload.old?.id);
        }
        const next = payload.new || payload.record || payload;
        if (!next?.id) return prev;
        const exists = prev.some(j => j.id === next.id);
        return exists ? prev.map(j => j.id === next.id ? { ...j, ...next } : j) : [next, ...prev];
      });
    }
  });

  return (
    <section>
      <div className="ocean-card" style={{padding:16, marginBottom:16}}>
        <h2 style={{marginTop:0}}>{t('jobs.list_title')}</h2>
        <div aria-live="polite" style={{color:'var(--color-muted)'}}>{t('jobs.updated_in_realtime')}</div>
      </div>
      {error && <div role="alert" className="ocean-card" style={{padding:16, borderColor:'var(--color-error)'}}>{error}</div>}
      <ul className="list" aria-label={t('jobs.list_title')}>
        {jobs.map(job => (
          <li key={job.id} className="list-item">
            <div>
              <div style={{fontWeight:600}}>{job.title || job.name || `#${job.id}`}</div>
              <div style={{color:'var(--color-muted)', fontSize:12}}>{job.company || job.location || ''}</div>
            </div>
            <div>
              <Link className="btn btn-primary" to={`/jobs/${job.id}`} aria-label={`View job ${job.title || job.id}`}>
                {t('jobs.view')}
              </Link>
            </div>
          </li>
        ))}
        {jobs.length === 0 && !error && (
          <li className="list-item" aria-live="polite">No jobs yet.</li>
        )}
      </ul>
    </section>
  );
}
