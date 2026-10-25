import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { youtubeId } from '../api/client';

const INTERVAL = 7000;

export default function Hero({ movies }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef();
  const count = movies.length;

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduced || count < 2) return undefined;
    timer.current = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(timer.current);
  }, [index, paused, count, go]);

  if (!count) return null;

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured movies"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1);
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
    >
      {movies.map((m, i) => {
        const yt = youtubeId(m.trailerLink);
        return (
          <div
            key={m.imdbId}
            className={`slide ${i === index ? 'active' : ''}`}
            aria-hidden={i !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${m.title}`}
          >
            <div className="backdrop" style={{ backgroundImage: `url(${m.backdrops[0]})` }} />
            <div className="container-xl slide-content">
              <img className="hero-poster" src={m.poster} alt="" />
              <div className="hero-text">
                <p className="eyebrow">{m.releaseDate.slice(0, 4)} · {m.genres.join(' / ')}</p>
                <h1>{m.title}</h1>
                <p className="overview">{m.overview}</p>
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  {yt && (
                    <Link to={`/trailer/${yt}`} className="btn-gold" tabIndex={i === index ? 0 : -1}>
                      <FontAwesomeIcon icon={faCirclePlay} /> Play trailer
                    </Link>
                  )}
                  <Link to={`/movie/${m.imdbId}`} className="btn-ghost" tabIndex={i === index ? 0 : -1}>
                    Reviews &amp; details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <button type="button" className="hero-arrow prev" onClick={() => go(index - 1)} aria-label="Previous movie">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button type="button" className="hero-arrow next" onClick={() => go(index + 1)} aria-label="Next movie">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      <div className="dots">
        {movies.map((m, i) => (
          <button key={m.imdbId} type="button" className={i === index ? 'on' : ''} onClick={() => go(i)} aria-label={`Show ${m.title}`} aria-current={i === index} />
        ))}
      </div>
    </section>
  );
}
