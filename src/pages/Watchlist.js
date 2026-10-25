import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../api/client';
import { useWatchlist } from '../hooks/useWatchlist';
import MovieCard from '../components/MovieCard';

export default function Watchlist() {
  const { ids } = useWatchlist();
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    getMovies().then(setMovies).catch(() => setMovies([]));
  }, []);

  if (!movies) return <div className="loading" aria-busy="true">Loading…</div>;
  const saved = movies.filter((m) => ids.includes(m.imdbId));

  return (
    <section className="container-xl py-5 page-top">
      <h1 className="page-title">Watch list</h1>
      {saved.length ? (
        <div className="movie-grid">{saved.map((m) => <MovieCard key={m.imdbId} movie={m} />)}</div>
      ) : (
        <p className="empty">
          Nothing saved yet. Tap the bookmark on any movie to keep it here. <Link to="/">Browse movies</Link>
        </p>
      )}
    </section>
  );
}
