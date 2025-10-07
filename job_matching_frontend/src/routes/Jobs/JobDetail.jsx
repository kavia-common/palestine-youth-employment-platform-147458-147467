import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { JobsAPI } from '../../services/apiClient';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 * JobDetail - Job detail page
 */
export default function JobDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    JobsAPI.get(id)
      .then(data => { if (mounted) setJob(data); })
      .catch(e => setError(e.message));
    return () => { mounted = false; };
  }, [id]);

  if (error) return <div role="alert" className="ocean-card" style={{padding:16}}>{error}</div>;
  if (!job) return <div className="ocean-card" style={{padding:16}}>Loading...</div>;

  return (
    <article className="ocean-card" style={{padding:16}}>
      <h2 style={{marginTop:0}}>{job.title || job.name}</h2>
      <p style={{color:'var(--color-muted)'}}>{job.company || ''}</p>
      <p>{job.description || '—'}</p>
      <button className="btn btn-secondary" aria-label="Apply">{t('jobs.apply')}</button>
    </article>
  );
}
