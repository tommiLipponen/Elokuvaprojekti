const validateGroupName = (name) => {
    if (!name || typeof name !== 'string') {
        return 'Group name is required';
    }

    if (name.trim().length < 1) {
        return 'Group name cannot be empty';
    }

    if (name.trim().length > 100) {
        return 'Group name cannot exceed 100 characters';
    }

    return null;
};

module.exports = {
    validateGroupName,
};