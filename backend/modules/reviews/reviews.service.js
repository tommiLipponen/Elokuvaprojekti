const { getPrisma } = require('../../config/prisma');

const createReview = async ({ movieId, userId, rating, comment }) => {
    const prisma = await getPrisma();

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