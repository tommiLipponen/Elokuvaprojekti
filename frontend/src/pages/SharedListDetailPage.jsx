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
            <div className="py-5 shared-list-detail-page">
                <p>Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-5 shared-list-detail-page">
                <div className="detail-page-title-row shared-list-detail-title-row">
                    <p className="shared-lists-error">{error}</p>
                    <Link
                        to="/shared"
                        className="btn btn-primary shared-list-back-button"
                    >
                        go back
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="py-5 shared-list-detail-page">
            <div>
                <div className="detail-page-title-row shared-list-detail-title-row">
                    <h2 className="shared-list-detail-title">
                        {list.name}
                    </h2>
                    <Link
                        to="/shared"
                        className="btn btn-primary shared-list-back-button"
                    >
                        go back
                    </Link>
                </div>

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
                    <div className="favorite-movie-grid">
                        {list.items.map((item) => (
                            <div
                                key={item.movieId}
                            >
                                <MovieCard movie={item.movie} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SharedListDetailPage