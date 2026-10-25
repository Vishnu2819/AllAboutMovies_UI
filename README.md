# AllAboutMovies

A movie browsing app: a featured-film carousel, a searchable catalog with genre filters, trailers, a watch list, and user reviews with star ratings. The frontend is React and the backend is the Spring Boot + MongoDB [AllAboutMovies API](https://github.com/Vishnu2819/AllAboutMovies_API).

**Live demo:** https://vishnu2819.github.io/AllAboutMovies_UI/

## Features

- **Hero carousel:** backdrops, posters and overviews. It autoplays, pauses on hover or focus, supports arrow keys and dot navigation, and respects `prefers-reduced-motion`.
- **Browse:** title search plus genre chips, stored in the URL so filtered views can be shared.
- **Movie pages:** runtime, genres, the TMDB score, the community rating average, a trailer, and a watch-list toggle.
- **Reviews:** a 1–5 star rating with optional name and text, posted to the API and shown newest first.
- **Trailers:** a full-width YouTube player (`react-player`).
- **Watch list:** saved in `localStorage` and kept in sync across components and tabs.
- **Two data modes:**
  - **Live:** set `REACT_APP_API_URL` and every request goes to the Spring Boot API.
  - **Demo:** when no API is configured, or it can't be reached, the app uses the same catalog bundled into the site and stores reviews in the browser. A banner says when demo mode is on. This is how the GitHub Pages build runs, since Pages can only host static files.

## Tech

React 18 · React Router 7 (`HashRouter` so deep links work on Pages) · Axios · Bootstrap 5 · Font Awesome · react-player · Jest + Testing Library

```
src/
  api/client.js        API client with demo-mode fallback (+ tests)
  components/          Header, Hero carousel, MovieCard, Stars, DemoBanner
  pages/               Home, MovieDetails, Trailer, Watchlist, NotFound
  hooks/useWatchlist   localStorage-backed watch list
  data/movies.json     bundled catalog (same seed as the API)
```

## Run locally

```bash
npm install
npm start                                            # demo mode on http://localhost:3000
REACT_APP_API_URL=http://localhost:8080 npm start    # against a local API
npm test
```

To run the API: `cd ../AllAboutMovies_API && docker compose up --build`.

## Deploy

`.github/workflows/deploy.yml` tests, builds and publishes to GitHub Pages on every push to `main`. To use live data, deploy the API and set a repository variable `API_URL` (Settings → Secrets and variables → Actions → Variables).

---

Movie data and images courtesy of [TMDB](https://www.themoviedb.org/). Not endorsed or certified by TMDB.
