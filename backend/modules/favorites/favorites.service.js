const { getPrisma } = require('../../config/prisma');

const createFavoriteList = async (name, isPublic, userId) => {
    const prisma = await getPrisma();

    const favoriteList = await prisma.favoriteList.create({
        data: {
            name,
            isPublic: Boolean(isPublic),
            userId,
        },
        include: {
            items: { include: { movie: true } },
        },
    });

    return favoriteList;
};

const getFavoriteLists = async (userId) => {
    const prisma = await getPrisma();

    const favoriteLists = await prisma.favoriteList.findMany({
        where: {
            userId,
        },
        include: {
            items: { include: { movie: true } },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return favoriteLists;
};

const getFavoriteListById = async (favoriteListId, userId) => {
    const prisma = await getPrisma();

    const favoriteList = await prisma.favoriteList.findUnique({
        where: {
            id: favoriteListId,
        },
        include: {
            items: { include: { movie: true } },
        },
    });

    if (!favoriteList) {
        return null;
    }

    const isOwner = favoriteList.userId === userId;

    if (!isOwner && !favoriteList.isPublic) {
        return {
            accessDenied: true,
        };
    }

    return favoriteList;
};

const deleteFavoriteList = async (favoriteListId, userId) => {
    const prisma = await getPrisma();

    const favoriteList = await prisma.favoriteList.findUnique({
        where: {
            id: favoriteListId,
        },
    });

    if (!favoriteList) {
        return null;
    }

    if (favoriteList.userId !== userId) {
        return {
            accessDenied: true,
        };
    }

    await prisma.favoriteList.delete({
        where: {
            id: favoriteListId,
        },
    });

    return favoriteList;
};

const addItemToList = async (favoriteListId, movieId, userId) => {
    const prisma = await getPrisma();

    const favoriteList = await prisma.favoriteList.findUnique({
        where: {
            id: favoriteListId,
        },
    });

    if (!favoriteList) {
        return null;
    }

    if (favoriteList.userId !== userId) {
        return {
            accessDenied: true,
        };
    }

    const movie = await prisma.movie.findUnique({
        where: {
            tmdbId: Number(movieId),
        },
    });

    if (!movie) {
        return {
            movieNotFound: true,
        };
    }

    const favoriteItem = await prisma.favoriteItem.create({
        data: {
            favoriteListId,
            movieId: movie.id,
        },
        include: {
            movie: true,
        },
    });

    return favoriteItem;
};

const removeItemFromList = async (favoriteListId, movieId, userId) => {
    const prisma = await getPrisma();

    const favoriteList = await prisma.favoriteList.findUnique({
        where: {
            id: favoriteListId,
        },
    });

    if (!favoriteList) {
        return null;
    }

    if (favoriteList.userId !== userId) {
        return {
            accessDenied: true,
        };
    }

    const favoriteItem = await prisma.favoriteItem.findUnique({
        where: {
            favoriteListId_movieId: {
                favoriteListId,
                movieId,
            },
        },
    });

    if (!favoriteItem) {
        return {
            itemNotFound: true,
        };
    }

    await prisma.favoriteItem.delete({
        where: {
            id: favoriteItem.id,
        },
    });

    return favoriteItem;
};

const toggleFavoriteListPublic = async (favoriteListId, isPublic, userId) => {
    const prisma = await getPrisma();

    const favoriteList = await prisma.favoriteList.findUnique({
        where: {
            id: favoriteListId,
        },
    });

    if (!favoriteList) {
        return null;
    }

    if (favoriteList.userId !== userId) {
        return {
            accessDenied: true,
        };
    }

    const updatedFavoriteList = await prisma.favoriteList.update({
        where: {
            id: favoriteListId,
        },
        data: {
            isPublic,
        },
    });

    return updatedFavoriteList;
};




module.exports = {
    createFavoriteList,
    getFavoriteLists,
    getFavoriteListById,
    deleteFavoriteList,
    addItemToList,
    removeItemFromList,
     toggleFavoriteListPublic,
};
