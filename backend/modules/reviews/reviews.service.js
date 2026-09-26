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

module.exports = {
    createReview,
};