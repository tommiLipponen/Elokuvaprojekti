import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNowPlaying, getPopularMovies } from '../services/movieApi.js'
import MovieCard from '../components/MovieCard.jsx'

function HomePage() {
  const [popularMovies, setPopularMovies] = useState([])
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])

  useEffect(() => {
    let cancelled = false

    async function loadMovies() {
      try {
        const [popular, nowPlaying] = await Promise.all([
          getPopularMovies(),
          getNowPlaying({ region: 'FI' }),
        ])

        if (!cancelled) {
          setPopularMovies(popular.slice(0, 4))
          setNowPlayingMovies(nowPlaying.slice(0, 4))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadMovies()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="home-page">

      <section>
        <h2 className="now-playing-title">
          popular movies
        </h2>

        <div className="movie-results">
          {popularMovies.map((movie) => (
            <MovieCard
              key={movie.tmdbId}
              movie={movie}
            />
          ))}
        </div>
      </section>

      <section className="home-cinema-section">
        <h2 className="now-playing-title">
          now in Finnish cinemas
        </h2>

        <div className="movie-results">
          {nowPlayingMovies.map((movie) => (
            <MovieCard
              key={movie.tmdbId}
              movie={movie}
            />
          ))}
        </div>

        <div className="home-find-more">
          <Link
            to="/movies/now-playing"
            className="btn btn-primary"
          >
            find more movies in cinemas!
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage