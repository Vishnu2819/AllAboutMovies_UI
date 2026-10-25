import axios from 'axios';
import bundledMovies from '../data/movies.json';

// When REACT_APP_API_URL points at the Spring Boot API the app talks to it.
// Otherwise (e.g. the GitHub Pages build) it runs in demo mode: the same catalog
// ships with the bundle and reviews are kept in this browser's localStorage.
const API_URL = process.env.REACT_APP_API_URL;
const REVIEWS_KEY = 'aam:reviews';

const http = API_URL ? axios.create({ baseURL: `${API_URL.replace(/\/$/, '')}/api/v1`, timeout: 8000 }) : null;

let demo = !http;
const listeners = new Set();
export const isDemoMode = () => demo;
export const onModeChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
function fallBack(err) {
  if (!demo) {
    // A network failure (API asleep or down) falls back to bundled data; real HTTP
    // errors like 404/400 are passed through so the UI can show them.
    if (err?.response) throw err;
    demo = true;
    listeners.forEach((fn) => fn(true));
  }
}

function readLocalReviews() {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || {};
  } catch {
    return {};
  }
}

function writeLocalReviews(all) {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
  } catch {
    // Storage blocked: the review still shows for this session.
  }
}

const average = (reviews) =>
  reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : null;

export function filterMovies(movies, { genre, q } = {}) {
  const query = (q || '').trim().toLowerCase();
  return movies
    .filter((m) => !genre || m.genres.some((g) => g.toLowerCase() === genre.toLowerCase()))
    .filter((m) => !query || m.title.toLowerCase().includes(query))
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

export class NotFoundError extends Error {}

export async function getMovies(params = {}) {
  if (!demo) {
    try {
      const { data } = await http.get('/movies', { params });
      return data;
    } catch (err) {
      fallBack(err);
    }
  }
  return filterMovies(bundledMovies, params);
}

export async function getGenres() {
  if (!demo) {
    try {
      const { data } = await http.get('/genres');
      return data;
    } catch (err) {
      fallBack(err);
    }
  }
  return [...new Set(bundledMovies.flatMap((m) => m.genres))].sort();
}

export async function getMovie(imdbId) {
  if (!demo) {
    try {
      const { data } = await http.get(`/movies/${imdbId}`);
      return data;
    } catch (err) {
      if (err?.response?.status === 404) throw new NotFoundError(imdbId);
      fallBack(err);
    }
  }
  const movie = bundledMovies.find((m) => m.imdbId === imdbId);
  if (!movie) throw new NotFoundError(imdbId);
  const reviews = (readLocalReviews()[imdbId] || []).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { movie, reviews, averageRating: average(reviews) };
}

export async function addReview(imdbId, { author, rating, body }) {
  if (!demo) {
    try {
      const { data } = await http.post(`/movies/${imdbId}/reviews`, { author, rating, body });
      return data;
    } catch (err) {
      fallBack(err);
    }
  }
  const review = {
    id: `local-${Date.now()}`,
    imdbId,
    author: author?.trim() || 'Anonymous',
    rating,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };
  const all = readLocalReviews();
  all[imdbId] = [review, ...(all[imdbId] || [])];
  writeLocalReviews(all);
  return review;
}

export const youtubeId = (url) => url?.match(/[?&]v=([A-Za-z0-9_-]{11})/)?.[1] ?? null;
