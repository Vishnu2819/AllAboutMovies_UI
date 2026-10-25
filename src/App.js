import { HashRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import DemoBanner from './components/DemoBanner';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Trailer from './pages/Trailer';
import Watchlist from './pages/Watchlist';
import NotFound from './pages/NotFound';

// HashRouter keeps deep links working on GitHub Pages, which has no SPA fallback.
export default function App() {
  return (
    <HashRouter>
      <Header />
      <DemoBanner />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:imdbId" element={<MovieDetails />} />
          <Route path="/trailer/:ytId" element={<Trailer />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container-xl">
          Built by <a href="https://vishnuvulli.netlify.app" target="_blank" rel="noreferrer">Vishnu Vulli</a> · React + Spring Boot + MongoDB ·{' '}
          <a href="https://github.com/Vishnu2819/AllAboutMovies_UI" target="_blank" rel="noreferrer">UI source</a> ·{' '}
          <a href="https://github.com/Vishnu2819/AllAboutMovies_API" target="_blank" rel="noreferrer">API source</a>
          <span className="tmdb">Movie data and images courtesy of TMDB. Not endorsed or certified by TMDB.</span>
        </div>
      </footer>
    </HashRouter>
  );
}
