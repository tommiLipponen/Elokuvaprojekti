const validateReview = ({ rating, comment }) => {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return 'Rating must be an integer between 1 and 5';
    } // Kokonaisluku välillä 1-5

    if (typeof comment !== 'string' || comment.trim().length === 0) {
        return 'Comment cannot be empty';
    } // Kommentti ei voi olla tyhjä

    return null;
};

module.exports = {
    validateReview,
};