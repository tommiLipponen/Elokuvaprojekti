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
            items: true,
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
            items: true,
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
            items: true,
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
            id: movieId,
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
            movieId,
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

module.exports = {
    createFavoriteList,
    getFavoriteLists,
    getFavoriteListById,
    deleteFavoriteList,
    addItemToList,
    removeItemFromList,
};
