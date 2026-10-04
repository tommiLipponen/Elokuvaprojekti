const { getPrisma } = require('../../config/prisma');
const { importMovieByTmdbId } = require('../movies/movies.import.service');

// Accepts either a DB movie id or a numeric TMDB id (used by search/cinema links).
const resolveMovieId = async (prisma, movieId) => {
    if (!/^\d+$/.test(movieId)) {
        return movieId;
    }

    const movie = await prisma.movie.findUnique({
        where: { tmdbId: Number(movieId) },
        select: { id: true },
    });

    if (movie) {
        return movie.id;
    }

    // Movies found via TMDB search may not be in the DB yet; import on demand.
    try {
        const imported = await importMovieByTmdbId(prisma, Number(movieId));
        return imported ? imported.id : movieId;
    } catch (error) {
        console.error(error);
        return movieId;
    }
};

const createReview = async ({ movieId, userId, rating, comment }) => {
    const prisma = await getPrisma();

    movieId = await resolveMovieId(prisma, movieId);

    const movie = await prisma.movie.findUnique({
        where: {
            id: movieId,
        },
    });

    if (!movie) {
        return null;
    }

    return prisma.review.create({
        data: {
            movieId,
            userId,
            rating,
            comment: comment.trim(),
        },
    });
};

const getMovieReviews = async (movieId) => {
    const prisma = await getPrisma();
    movieId = await resolveMovieId(prisma, movieId);

    const reviews = await prisma.review.findMany({
        where: { movieId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
                select: { username: true },
            },
        },
    });

    return reviews.map(({ user, ...review }) => ({
        ...review,
        username: user.username,
    }));
};

module.exports = {
    createReview,
    getMovieReviews,
};