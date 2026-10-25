import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getGenres, getMovies } from '../api/client';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [all, setAll] = useState(null);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [params, setParams] = useSearchParams();
  const genre = params.get('genre') || '';
  const q = params.get('q') || '';

  useEffect(() => {
    Promise.all([getMovies(), getGenres()])
      .then(([movies, g]) => {
        setAll(movies);
        setGenres(g);
      })
      .catch(() => setError('Could not load movies. Please try again.'));
  }, []);

  const visible = useMemo(() => {
    if (!all) return [];
    const query = q.trim().toLowerCase();
    return all
      .filter((m) => !genre || m.genres.includes(genre))
      .filter((m) => !query || m.title.toLowerCase().includes(query));
  }, [all, genre, q]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  if (error) return <p className="container-xl py-5 text-center">{error}</p>;
  if (!all) return <div className="loading" aria-busy="true">Loading…</div>;

  return (
    <>
      <Hero movies={all.slice(0, 6)} />
      <section className="container-xl py-5" aria-labelledby="browse-heading">
        <div className="browse-head">
          <h2 id="browse-heading">Browse</h2>
          <input
            type="search"
            className="search"
            placeholder="Search titles…"
            aria-label="Search titles"
            value={q}
            onChange={(e) => update('q', e.target.value)}
          />
        </div>
        <div className="genre-chips" role="group" aria-label="Filter by genre">
          <button type="button" className={!genre ? 'on' : ''} aria-pressed={!genre} onClick={() => update('genre', '')}>All</button>
          {genres.map((g) => (
            <button type="button" key={g} className={genre === g ? 'on' : ''} aria-pressed={genre === g} onClick={() => update('genre', genre === g ? '' : g)}>
              {g}
            </button>
          ))}
        </div>
        {visible.length ? (
          <div className="movie-grid">
            {visible.map((m) => <MovieCard key={m.imdbId} movie={m} />)}
          </div>
        ) : (
          <p className="empty">No movies match that search.</p>
        )}
      </section>
    </>
  );
}
