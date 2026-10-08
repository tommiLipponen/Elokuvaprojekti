import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMovies } from '../hooks/useMovies.js'
import { getNowPlaying } from '../services/movieApi.js'
import MovieCard from '../components/MovieCard.jsx'

function HomePage() {
  const [title, setTitle] = useState('')
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])

  const { search } = useMovies()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    await search({
      title,
      genre: '',
      year: '',
    })

    navigate('/movies')
  }

  useEffect(() => {
    let cancelled = false

    async function loadNowPlayingMovies() {
      try {
        const results = await getNowPlaying({ region: 'FI' })

        if (!cancelled) {
          setNowPlayingMovies(results.slice(0, 3))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadNowPlayingMovies()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="home-page">
      <section className="home-hero">
        <h2 className="home-title">
          find your next favorite movie
        </h2>

        <form
          onSubmit={handleSubmit}
          className="home-search-form"
        >
          <input
            type="text"
            className="form-control home-search-input"
            placeholder="Search by movie title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
            search!
          </button>
        </form>
      </section>

      <section className="home-now-playing">
        <h2 className="now-playing-title">
          now in Finnish cinemas
        </h2>

        <div className="home-movie-results">
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
            find more movies!
          </Link>
        </div>
      </section>
    </main>
  )
}

export default HomePage