const { getPrisma } = require('../../config/prisma');

const createGroupMovie = async (groupId, movieId, userId) => {
    const prisma = await getPrisma();

    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
        include: {
            memberships: true,
        },
    });

    if (!group) {
        return null;
    }

    const isOwner = group.ownerId === userId;

    const isApprovedMember = group.memberships.some(
        (membership) =>
            membership.userId === userId &&
            membership.status === 'APPROVED'
    );

    if (!isOwner && !isApprovedMember) {
        return {
            accessDenied: true,
        };
    }

    const movie = await prisma.movie.findUnique({
        where: {
            id: movieId,
        },
    });

    if (!movie) {
        return {
            movieNotFound: true,
        };
    }

    try {
        const groupMovie = await prisma.groupMovie.create({
            data: {
                groupId,
                movieId,
                addedBy: userId,
            },
        });

        return groupMovie;
    } catch (error) {
        if (error.code === 'P2002') {
            return {
                alreadyExists: true,
            };
        }

        throw error;
    }
};

module.exports = {
    createGroupMovie,
};
