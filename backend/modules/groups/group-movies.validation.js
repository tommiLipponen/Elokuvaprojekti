const validateMovieId = (movieId) => {
    if (!movieId || typeof movieId !== 'string') {
        return 'Movie ID is required';
    }

    if (movieId.trim().length < 1) {
        return 'Movie ID cannot be empty';
    }

    return null;
};

module.exports = {
    validateMovieId,
};

