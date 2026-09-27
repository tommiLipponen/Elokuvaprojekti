const {
    createFavoriteList,
    getFavoriteLists,
    getFavoriteListById,
    deleteFavoriteList,
    addItemToList,
    removeItemFromList,
} = require('./favorites.service');

const { validateFavoriteListName, validateMovieId } = require('./favorites.validation');

const create = async (req, res) => {
    try {
        const { name, isPublic } = req.body;

        const validationError = validateFavoriteListName(name);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const favoriteList = await createFavoriteList(name, isPublic, req.user.userId);

        return res.status(201).json(favoriteList);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Failed to create favorite list' });
    }
};

const list = async (req, res) => {
    try {
        const favoriteLists = await getFavoriteLists(req.user.userId);

        return res.status(200).json(favoriteLists);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Failed to get favorite lists' });
    }
};

const getById = async (req, res) => {
    try {
        const favoriteList = await getFavoriteListById(req.params.id, req.user.userId);

        if (!favoriteList) {
            return res.status(404).json({ message: 'Favorite list not found' });
        }

        if (favoriteList.accessDenied) {
            return res.status(403).json({ message: 'Not the owner of this favorite list' });
        }

        return res.status(200).json(favoriteList);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Failed to get favorite list' });
    }
};

const remove = async (req, res) => {
    try {
        const favoriteList = await deleteFavoriteList(req.params.id, req.user.userId);

        if (!favoriteList) {
            return res.status(404).json({ message: 'Favorite list not found' });
        }

        if (favoriteList.accessDenied) {
            return res.status(403).json({ message: 'Not the owner of this favorite list' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Failed to delete favorite list' });
    }
};

const addItem = async (req, res) => {
    try {
        const { movieId } = req.body;

        const validationError = validateMovieId(movieId);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const favoriteItem = await addItemToList(req.params.id, movieId, req.user.userId);

        if (!favoriteItem) {
            return res.status(404).json({ message: 'Favorite list not found' });
        }

        if (favoriteItem.accessDenied) {
            return res.status(403).json({ message: 'Not the owner of this favorite list' });
        }

        if (favoriteItem.movieNotFound) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        return res.status(201).json(favoriteItem);
    } catch (error) {
        console.error(error);

        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Movie is already in the favorite list' });
        }

        return res.status(500).json({ message: 'Failed to add movie to favorite list' });
    }
};

const removeItem = async (req, res) => {
    try {
        const favoriteItem = await removeItemFromList(
            req.params.id,
            req.params.movieId,
            req.user.userId
        );

        if (!favoriteItem) {
            return res.status(404).json({ message: 'Favorite list not found' });
        }

        if (favoriteItem.accessDenied) {
            return res.status(403).json({ message: 'Not the owner of this favorite list' });
        }

        if (favoriteItem.itemNotFound) {
            return res.status(404).json({ message: 'Favorite list item not found' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Failed to remove movie from favorite list' });
    }
};

module.exports = {
    create,
    list,
    getById,
    remove,
    addItem,
    removeItem,
};
