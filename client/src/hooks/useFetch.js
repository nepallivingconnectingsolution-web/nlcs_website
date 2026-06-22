import { useEffect, useState } from 'react';
import api from '../api/axios.js';

/**
 * Fetch from the API with graceful fallback to static data so the UI
 * always renders, even before the backend/DB is running.
 * Returns { data, loading, error, usingFallback }.
 */
export default function useFetch(path, { fallback = null } = {}) {
  const [state, setState] = useState({
    data: fallback,
    loading: true,
    error: null,
    usingFallback: false,
  });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    api
      .get(path)
      .then((res) => {
        if (!active) return;
        const payload = res.data?.data ?? res.data;
        const empty = Array.isArray(payload) && payload.length === 0;
        setState({
          data: empty && fallback ? fallback : payload,
          loading: false,
          error: null,
          usingFallback: empty && !!fallback,
        });
      })
      .catch((err) => {
        if (!active) return;
        setState({
          data: fallback,
          loading: false,
          error: err.message,
          usingFallback: !!fallback,
        });
      });

    return () => {
      active = false;
    };
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
