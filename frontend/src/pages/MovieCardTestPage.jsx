import MovieCard from '../components/MovieCard.jsx'

function MovieCardTestPage() {
  const movies = [
    {
      tmdbId: 550,
      title: 'Fight Club',
      releaseYear: 1999,
      overview: 'A short description.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/bptfVGEQuv6DaWnj8IVW3j5g6hT.jpg',
    },
    {
      tmdbId: 27205,
      title: 'Inception',
      releaseYear: 2010,
      overview:
        'A much longer description that lets you see how the card behaves when there is more text.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    },
    {
      tmdbId: 157336,
      title: 'Interstellar',
      releaseYear: 2014,
      overview: '',
      posterUrl: '',
    },
  ]

  const testGroups = [
    {
      id: 1,
      name: 'My Movie Group',
    },
    {
      id: 2,
      name: 'Weekend Movies',
    },
  ]

  const testFavoriteLists = [
    {
      id: 1,
      name: 'Favorites',
    },
    {
      id: 2,
      name: 'Movies to Watch',
    },
  ]

  return (
    <div className="container py-5">
      <h1 className="mb-4">Movie Card Test</h1>

      <div className="row g-4">
        {movies.map((movie) => (
          <div className="col-md-4" key={movie.tmdbId}>
            <MovieCard
              movie={movie}
              showActions={true}
              testGroups={testGroups}
              testFavoriteLists={testFavoriteLists}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MovieCardTestPage