import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { useWatchlist } from '../hooks/useWatchlist';

export default function MovieCard({ movie }) {
  const { has, toggle } = useWatchlist();
  const saved = has(movie.imdbId);
  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.imdbId}`} className="poster-link">
        <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
        {movie.userScore != null && <span className="score">{movie.userScore}%</span>}
      </Link>
      <button
        type="button"
        className={`save ${saved ? 'on' : ''}`}
        onClick={() => toggle(movie.imdbId)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${movie.title} from watch list` : `Add ${movie.title} to watch list`}
      >
        <FontAwesomeIcon icon={faBookmarkSolid} />
      </button>
      <div className="meta">
        <Link to={`/movie/${movie.imdbId}`} className="title">{movie.title}</Link>
        <span>{movie.releaseDate.slice(0, 4)} · {movie.genres.slice(0, 2).join(', ')}</span>
      </div>
    </article>
  );
}
