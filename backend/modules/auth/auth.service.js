const bcrypt = require('bcrypt');
const { getPrisma } = require('../../config/prisma');

const createUser = async (email, password) => {
    const prisma = await getPrisma();
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split('@')[0];

    const user = await prisma.user.create({
        data: { email, username, passwordHash: hashedPassword },
    });

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return safeUser;
};

module.exports = { createUser };
