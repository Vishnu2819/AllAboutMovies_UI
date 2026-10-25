import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { useWatchlist } from '../hooks/useWatchlist';

export default function Header() {
  const { ids } = useWatchlist();
  return (
    <header className="site-header">
      <div className="container-xl d-flex align-items-center gap-4">
        <Link to="/" className="brand" aria-label="AllAboutMovies home">
          <FontAwesomeIcon icon={faFilm} />
          <span>AllAbout<b>Movies</b></span>
        </Link>
        <nav className="main-nav ms-auto">
          <NavLink to="/" end>Browse</NavLink>
          <NavLink to="/watchlist">
            Watch list{ids.length > 0 && <span className="count">{ids.length}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
