// Stub handlers for the favorites API contract (PBI 15 / task 195).
// Business logic is implemented in task 196 (backend favorites module).
const notImplemented = (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
};

module.exports = {
    create: notImplemented,
    list: notImplemented,
    getById: notImplemented,
    remove: notImplemented,
    addItem: notImplemented,
    removeItem: notImplemented,
};
