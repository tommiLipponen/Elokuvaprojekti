const { deleteUser } = require('./user.service');

const deleteMe = async (req, res) => {
    try {
        await deleteUser(req.user.userId);

        return res.status(204).send();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Failed to delete user',
        });
    }
};

module.exports = {
    deleteMe,
};
