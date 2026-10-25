import { addReview, filterMovies, getMovie, getMovies, NotFoundError, youtubeId } from './client';

beforeEach(() => localStorage.clear());

test('demo mode serves the bundled catalog newest first', async () => {
  const movies = await getMovies();
  expect(movies).toHaveLength(14);
  expect(movies[0].title).toBe('Dune: Part Two');
});

test('filters by genre and title', () => {
  const sample = [
    { title: 'The Matrix', genres: ['Action'], releaseDate: '1999-03-31' },
    { title: 'Whiplash', genres: ['Drama'], releaseDate: '2014-10-10' },
  ];
  expect(filterMovies(sample, { genre: 'action' }).map((m) => m.title)).toEqual(['The Matrix']);
  expect(filterMovies(sample, { q: ' WHIP' }).map((m) => m.title)).toEqual(['Whiplash']);
});

test('reviews persist locally and update the average', async () => {
  await addReview('tt0133093', { author: '', rating: 5, body: ' There is no spoon. ' });
  await addReview('tt0133093', { author: 'Trinity', rating: 4, body: 'Still holds up.' });
  const { reviews, averageRating } = await getMovie('tt0133093');
  expect(reviews).toHaveLength(2);
  expect(reviews.map((r) => r.author).sort()).toEqual(['Anonymous', 'Trinity']);
  expect(reviews.find((r) => r.author === 'Anonymous').body).toBe('There is no spoon.');
  expect(averageRating).toBe(4.5);
});

test('unknown movie throws NotFoundError', async () => {
  await expect(getMovie('tt0000000')).rejects.toBeInstanceOf(NotFoundError);
});

test('extracts YouTube ids', () => {
  expect(youtubeId('https://www.youtube.com/watch?v=Jvurpf91omw')).toBe('Jvurpf91omw');
  expect(youtubeId(null)).toBeNull();
});
