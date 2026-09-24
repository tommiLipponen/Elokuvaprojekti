const {createGroupMovie,} = require('./group-movies.service');
const {validateMovieId,} = require('./group-movies.validation');

const create = async (req, res) => {
    try {
        const { movieId } = req.body;

        const validationError = validateMovieId(movieId);

        if (validationError) {
            return res.status(400).json({
                message: validationError,
            });
        }

        const groupMovie = await createGroupMovie(
            req.params.id,
            movieId,
            req.user.userId
        );

        if (!groupMovie) {
            return res.status(404).json({
                message: 'Group not found',
            });
        }

        if (groupMovie.accessDenied) {
            return res.status(403).json({
                message: 'You need to be an approved member to add movies to this group',
            });
        }

        if (groupMovie.movieNotFound) {
            return res.status(404).json({
                message: 'Movie not found',
            });
        }

        if (groupMovie.alreadyExists) {
            return res.status(409).json({
                message: 'Movie already exists in this group',
            });
        }

        return res.status(201).json(groupMovie);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Failed to add movie to group',
        });
    }
};

module.exports = {
    create,
};
