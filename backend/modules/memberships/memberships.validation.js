const validateJoinRequestStatus = (status) => {
    if (!status) {
        return 'Status is required';
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return 'Status must be APPROVED or REJECTED';
    }

    return null;

};

module.exports = {
    validateJoinRequestStatus,
};