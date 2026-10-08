import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPublicFavoriteLists } from '../services/favoriteApi.js'
import MovieCard from '../components/MovieCard.jsx'

function SharedListDetailPage() {
    const { id } = useParams()

    const [list, setList] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        getPublicFavoriteLists()
            .then((data) => {
                if (cancelled) return

                const selectedList = data.find(
                    (item) => String(item.id) === String(id)
                )

                if (!selectedList) {
                    setError('Shared list not found.')
                    return
                }

                setList(selectedList)
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || 'Failed to load shared list')
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [id])

    if (loading) {
        return (
            <main className="container py-5 shared-list-detail-page">
                <p>Loading...</p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="container py-5 shared-list-detail-page">
                <Link
                    to="/shared"
                    className="btn btn-primary shared-list-back-button"
                >
                    go back
                </Link>

                <p className="shared-lists-error">
                    {error}
                </p>
            </main>
        )
    }

    return (
        <main className="container py-5 shared-list-detail-page">
            <Link
                to="/shared"
                className="btn btn-primary shared-list-back-button"
            >
                go back
            </Link>

            <div className="shared-list-detail-card">
                <h2 className="shared-list-detail-title">
                    {list.name}
                </h2>

                {list.user?.username && (
                    <p className="shared-list-owner">
                        by {list.user.username}
                    </p>
                )}

                {!list.items || list.items.length === 0 ? (
                    <p className="shared-list-empty">
                        No movies in this list yet.
                    </p>
                ) : (
                    <div className="shared-list-movies">
                        {list.items.map((item) => (
                            <div
                                className="shared-list-movie"
                                key={item.movieId}
                            >
                                <MovieCard movie={item.movie} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default SharedListDetailPage