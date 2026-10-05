const { getPrisma } = require('../../config/prisma');
const { importMovieByTmdbId } = require('../movies/movies.import.service');

const createGroup = async (name, ownerId) => {
    const prisma = await getPrisma();

    const group = await prisma.group.create({
        data: {
            name,
            ownerId,
        },
    });

    return group;
};

const getGroups = async () => {
    const prisma = await getPrisma();

    const groups = await prisma.group.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return groups;
};

const getMyGroups = async (userId) => {
    const prisma = await getPrisma();

    const groups = await prisma.group.findMany({
        where: {
            OR: [
                {
                    ownerId: userId,
                },
                {
                    memberships: {
                        some: {
                            userId,
                            status: 'APPROVED',
                        },
                    },
                },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return groups;
};


const getGroupById = async (groupId, userId) => {
    const prisma = await getPrisma();

    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
        include: {
            memberships: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            },
            groupMovies: {
                include: {
                    movie: true,
                },
            },
        },
    });

    if (!group) {
        return null;
    }

    const isOwner = group.ownerId === userId;

    const isMember = group.memberships.some(
        (membership) =>
            membership.userId === userId &&
            membership.status === 'APPROVED'
    );

    if (!isOwner && !isMember) {
        return {
            accessDenied: true,
        };
    }

    return group;
};

const deleteGroup = async (groupId, userId) => {
    const prisma = await getPrisma();

    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
    });

    if (!group) {
        return null;
    }

    if (group.ownerId !== userId) {
        return {
            accessDenied: true,
        };
    }
    await prisma.group.delete({
        where: {
            id: groupId,
        },
    });

    return group;

};


const addMovieToGroup = async (groupId, movieTmdbId, userId) => {
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

    let movie = await prisma.movie.findUnique({
        where: {
            tmdbId: Number(movieTmdbId)
        },
    });

    // Seed data only covers a curated subset of TMDB; import on demand so any searched movie can be added.
    if (!movie) {
        try {
            movie = await importMovieByTmdbId(prisma, Number(movieTmdbId));
        } catch (error) {
            console.error(error);
        }
    }

    if (!movie) {
        return {
            movieNotFound: true,
        };
    }

    const groupMovie = await prisma.groupMovie.create({
        data: {
            groupId,
            movieId: movie.id,
            addedBy: userId,
        },
    });

    return groupMovie;
};

module.exports = {
    createGroup,
    getGroups,
    getMyGroups,
    getGroupById,
    deleteGroup,
    addMovieToGroup,
};