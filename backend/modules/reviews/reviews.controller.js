const { createReview } = require('./reviews.service');
const { validateReview } = require('./reviews.validation');

const createReviewHandler = async (req, res) => {
    const { rating, comment } = req.body;

    const validationError = validateReview({ rating, comment });

    if (validationError) {
        return res.status(400).json({
            message: validationError,
        });
    }

    try {
        const review = await createReview({
            movieId: req.params.id,
            userId: req.user.userId,
            rating,
            comment,
        });

        if (!review) {
            return res.status(404).json({
                message: 'Movie not found',
            });
        }

        return res.status(201).json(review);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Failed to create review',
        });
    }
};

module.exports = {
    createReviewHandler,
};