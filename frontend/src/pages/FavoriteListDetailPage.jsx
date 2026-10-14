import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard.jsx'
import { useAuth } from '../context/useAuth.js'
import {
    getFavoriteListById,
    removeItemFromList,
} from '../services/favoriteApi.js'

function FavoriteListDetailPage() {
    const { id } = useParams()
    const { accessToken } = useAuth()
    const [result, setResult] = useState({
        id: null,
        list: null,
        loading: true,
        error: '',
    })
    const [removingMovieId, setRemovingMovieId] = useState(null)
    const [actionError, setActionError] = useState('')

    useEffect(() => {
        let cancelled = false

        async function loadList() {
            try {
                const data = await getFavoriteListById(id, accessToken)
                if (cancelled) return

                if (data?.message) {
                    setResult({ id, list: null, loading: false, error: data.message })
                    return
                }

                if (!data || !data.id) {
                    setResult({
                        id,
                        list: null,
                        loading: false,
                        error: 'Favorite list not found.',
                    })
                    return
                }

                setResult({ id, list: data, loading: false, error: '' })
            } catch (err) {
                if (!cancelled) {
                    setResult({
                        id,
                        list: null,
                        loading: false,
                        error: err.message || 'Failed to load favorite list.',
                    })
                }
            }
        }

        loadList()

        return () => {
            cancelled = true
        }
    }, [id, accessToken])

    const isCurrentResult = result.id === id
    const loading = !isCurrentResult || result.loading
    const list = isCurrentResult ? result.list : null
    const error = isCurrentResult ? result.error : ''

    async function handleRemoveMovie(movieId) {
        setRemovingMovieId(movieId)
        setActionError('')

        try {
            const response = await removeItemFromList(id, movieId, accessToken)
            if (response?.message) {
                throw new Error(response.message)
            }

            setResult((current) => {
                if (current.id !== id || !current.list) {
                    return current
                }

                return {
                    ...current,
                    list: {
                        ...current.list,
                        items: current.list.items.filter(
                            (item) => item.movieId !== movieId,
                        ),
                    },
                }
            })
        } catch (err) {
            setActionError(err.message || 'Failed to remove movie.')
        } finally {
            setRemovingMovieId(null)
        }
    }

    if (loading) {
        return (
            <main className="container py-5 favorite-list-detail-page">
                <p role="status">Loading...</p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="container py-5 favorite-list-detail-page">
                <div className="detail-page-title-row shared-list-detail-title-row">
                    <p className="favorite-list-error" role="alert">
                        {error}
                    </p>
                    <Link
                        to="/favorites"
                        className="btn btn-primary shared-list-back-button"
                    >
                        go back
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="container py-5 favorite-list-detail-page">
            <div className="detail-page-title-row">
                <h2 className="favorite-list-title">
                    {list.name}
                </h2>
                <Link
                    to="/favorites"
                    className="btn btn-primary shared-list-back-button"
                >
                    go back
                </Link>
            </div>

            {actionError && (
                <p className="favorite-list-error" role="alert">
                    {actionError}
                </p>
            )}

            {!list.items || list.items.length === 0 ? (
                <p className="favorite-list-empty">
                    No movies in this list yet.
                </p>
            ) : (
                <div className="favorite-movie-grid">
                    {list.items.map((item) => (
                        <div key={item.movieId}>
                            {item.movie ? (
                                <MovieCard
                                    movie={item.movie}
                                    footerAction={
                                        <button
                                            type="button"
                                            className="btn btn-primary favorite-card-remove-button"
                                            onClick={() => handleRemoveMovie(item.movieId)}
                                            disabled={removingMovieId === item.movieId}
                                        >
                                            {removingMovieId === item.movieId
                                                ? 'removing...'
                                                : 'remove movie'}
                                        </button>
                                    }
                                />
                            ) : (
                                <p>Movie ID: {item.movieId}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default FavoriteListDetailPage
