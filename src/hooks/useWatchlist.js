import { useCallback, useEffect, useState } from 'react';

const KEY = 'aam:watchlist';
const EVENT = 'aam:watchlist-change';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

/** Watch list of imdbIds kept in localStorage and synced across components and tabs. */
export function useWatchlist() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((imdbId) => {
    const current = read();
    const next = current.includes(imdbId) ? current.filter((id) => id !== imdbId) : [...current, imdbId];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore: storage unavailable
    }
    setIds(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { ids, has: (id) => ids.includes(id), toggle };
}
