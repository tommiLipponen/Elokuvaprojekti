const validateFavoriteListName = (name) => {
    if (!name || typeof name !== 'string') {
        return 'Favorite list name is required';
    }

    if (name.trim().length < 1) {
        return 'Favorite list name cannot be empty';
    }

    if (name.trim().length > 100) {
        return 'Favorite list name cannot exceed 100 characters';
    }

    return null;
};

const validateMovieId = (movieId) => {
    if (!movieId || typeof movieId !== 'string') {
        return 'Movie ID is required';
    }

    return null;
};

const validateIsPublic = (isPublic) => {
    if (typeof isPublic !== 'boolean') {
        return 'isPublic must be a boolean';
    }

    return null;
};


module.exports = {
    validateFavoriteListName,
    validateMovieId,
    validateIsPublic,
};
