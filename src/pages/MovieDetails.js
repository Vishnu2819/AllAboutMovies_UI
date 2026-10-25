import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faBookmark, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { addReview, getMovie, NotFoundError, youtubeId } from '../api/client';
import { useWatchlist } from '../hooks/useWatchlist';
import { StarDisplay, StarInput } from '../components/Stars';
import NotFound from './NotFound';

const runtime = (m) => (m ? `${Math.floor(m / 60)}h ${m % 60}m` : null);
const date = (iso) => new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export default function MovieDetails() {
  const { imdbId } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const { has, toggle } = useWatchlist();

  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus('loading');
    getMovie(imdbId)
      .then((d) => {
        setData(d);
        setStatus('ready');
        document.title = `${d.movie.title} · AllAboutMovies`;
      })
      .catch((e) => setStatus(e instanceof NotFoundError ? 'missing' : 'error'));
    return () => {
      document.title = 'AllAboutMovies';
    };
  }, [imdbId]);

  async function submit(e) {
    e.preventDefault();
    if (!rating) return setFormError('Pick a star rating.');
    if (body.trim().length < 3) return setFormError('Write at least a few words.');
    setFormError('');
    setSaving(true);
    try {
      const review = await addReview(imdbId, { author, rating, body });
      setData((d) => {
        const reviews = [review, ...d.reviews];
        const avg = Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
        return { ...d, reviews, averageRating: avg };
      });
      setBody('');
      setRating(0);
    } catch {
      setFormError('Could not save your review. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (status === 'missing') return <NotFound />;
  if (status === 'error') return <p className="container-xl py-5 text-center">Something went wrong loading this movie.</p>;
  if (status === 'loading') return <div className="loading" aria-busy="true">Loading…</div>;

  const { movie, reviews, averageRating } = data;
  const yt = youtubeId(movie.trailerLink);
  const saved = has(movie.imdbId);

  return (
    <article className="details">
      <div className="details-backdrop" style={{ backgroundImage: `url(${movie.backdrops[0]})` }} />
      <div className="container-xl details-inner">
        <Link to="/" className="back"><FontAwesomeIcon icon={faArrowLeft} /> Back to browse</Link>
        <div className="details-grid">
          <img className="details-poster" src={movie.poster} alt={`${movie.title} poster`} />
          <div>
            <h1>{movie.title}</h1>
            <p className="facts">
              {movie.releaseDate.slice(0, 4)} · {runtime(movie.runtimeMinutes)} · {movie.genres.join(', ')}
            </p>
            <div className="ratings">
              {movie.userScore != null && <span className="pill">TMDB {movie.userScore}%</span>}
              {averageRating != null ? (
                <span className="pill"><StarDisplay value={averageRating} /> {averageRating} · {reviews.length} review{reviews.length > 1 ? 's' : ''}</span>
              ) : (
                <span className="pill muted">No reviews yet</span>
              )}
            </div>
            <p className="overview">{movie.overview}</p>
            <div className="d-flex flex-wrap gap-3">
              {yt && <Link to={`/trailer/${yt}`} className="btn-gold"><FontAwesomeIcon icon={faCirclePlay} /> Play trailer</Link>}
              <button type="button" className={`btn-ghost ${saved ? 'on' : ''}`} onClick={() => toggle(movie.imdbId)} aria-pressed={saved}>
                <FontAwesomeIcon icon={faBookmark} /> {saved ? 'On your watch list' : 'Add to watch list'}
              </button>
            </div>
          </div>
        </div>

        <section className="reviews" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading">Reviews</h2>
          <form className="review-form" onSubmit={submit} noValidate>
            <StarInput value={rating} onChange={setRating} />
            <input className="field" placeholder="Your name (optional)" aria-label="Your name" maxLength={40} value={author} onChange={(e) => setAuthor(e.target.value)} />
            <textarea className="field" rows={3} placeholder={`What did you think of ${movie.title}?`} aria-label="Your review" maxLength={1000} value={body} onChange={(e) => setBody(e.target.value)} />
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <button type="submit" className="btn-gold" disabled={saving}>{saving ? 'Posting…' : 'Post review'}</button>
          </form>
          {reviews.length === 0 ? (
            <p className="empty">Be the first to review {movie.title}.</p>
          ) : (
            <ul className="review-list">
              {reviews.map((r) => (
                <li key={r.id}>
                  <div className="review-head">
                    <strong>{r.author}</strong>
                    <StarDisplay value={r.rating} />
                    <time dateTime={r.createdAt}>{date(r.createdAt)}</time>
                  </div>
                  <p>{r.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  );
}
