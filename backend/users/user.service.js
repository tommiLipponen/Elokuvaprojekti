const { getPrisma } = require('../config/prisma');

const deleteUser = async (userId) => {
    const prisma = await getPrisma();

        console.log('DELETE USER ID:', userId);
// Delete the user from the database using Prisma
    await prisma.user.delete({
        where: {
//Delete the user with the specified userId
            id: userId,
        },
    });
};

module.exports = {
    deleteUser,
};
