const bcrypt = require('bcrypt');
const { getPrisma } = require('../../config/prisma');
const { generateAccessToken, generateRefreshToken, revokeRefreshToken } = require('./token.service');

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

const login = async (email, password) => {
    const prisma = await getPrisma();

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
        throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const safeUser = { id: user.id, email: user.email, username: user.username };

    return { accessToken, refreshToken, user: safeUser };
}

module.exports = { createUser, login, revokeRefreshToken };
