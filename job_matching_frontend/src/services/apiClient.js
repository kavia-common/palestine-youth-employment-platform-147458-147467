const API_BASE = process.env.REACT_APP_API_BASE_URL;

/**
 * PUBLIC_INTERFACE
 * request - Generic API request helper using fetch
 * @param {string} path - API path starting with /
 * @param {RequestInit} options - fetch options
 * @returns {Promise<any>} parsed JSON response
 */
export async function request(path, options = {}) {
  if (!API_BASE) {
    console.warn(
      'REACT_APP_API_BASE_URL is not set. Using relative path which may fail in development. ' +
      'Set REACT_APP_API_BASE_URL to your backend preview, e.g., http://localhost:3001'
    );
  }
  const base = API_BASE ?? '';
  const url = `${base}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(url, { ...options, headers, mode: 'cors' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

/**
 * PUBLIC_INTERFACE
 * JobsAPI - wrapper for Jobs endpoints
 */
export const JobsAPI = {
  /**
   * Get list of jobs
   */
  async list() {
    return request('/api/jobs');
  },
  /**
   * Get job by id
   */
  async get(id) {
    return request(`/api/jobs/${id}`);
  }
};
