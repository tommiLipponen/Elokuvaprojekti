const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { getPrisma } = require('../../config/prisma');
const { generateAccessToken, generateRefreshToken, revokeRefreshToken } = require('./token.service');

// Distinguishes bad credentials (401) from unexpected server errors (500) in the controller
class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid email or password');
        this.name = 'InvalidCredentialsError';
    }
}

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
        throw new InvalidCredentialsError();
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
        throw new InvalidCredentialsError();
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    const safeUser = { id: user.id, email: user.email, username: user.username };

    return { accessToken, refreshToken, user: safeUser };
}

module.exports = { createUser, login, revokeRefreshToken, InvalidCredentialsError };
