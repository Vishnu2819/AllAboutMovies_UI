import { useEffect, useState } from 'react';
import { isDemoMode, onModeChange } from '../api/client';

export default function DemoBanner() {
  const [demo, setDemo] = useState(isDemoMode());
  useEffect(() => onModeChange(setDemo), []);
  if (!demo) return null;
  return (
    <div className="demo-banner" role="note">
      Demo mode: the catalog is bundled with the site, and reviews are saved in your browser.{' '}
      <a href="https://github.com/Vishnu2819/AllAboutMovies_API" target="_blank" rel="noreferrer">
        See the Spring Boot API
      </a>
    </div>
  );
}
