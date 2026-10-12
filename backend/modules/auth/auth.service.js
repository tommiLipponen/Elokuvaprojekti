const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { getPrisma } = require('../../config/prisma');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken } = require('./token.service');

// Distinguishes bad credentials (401) from unexpected server errors (500) in the controller
class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid email or password');
        this.name = 'InvalidCredentialsError';
    }
}

class InvalidRefreshTokenError extends Error {
    constructor() {
        super('Invalid refresh token');
        this.name = 'InvalidRefreshTokenError';
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

    return issueTokens(prisma, user);
}

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const issueTokens = async (prisma, user) => {
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash: hashToken(refreshToken),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    const safeUser = { id: user.id, email: user.email, username: user.username };

    return { accessToken, refreshToken, user: safeUser };
};

// Rotates the refresh token: the presented one is revoked and a new pair is issued
const refresh = async (refreshToken) => {
    if (typeof refreshToken !== 'string' || !refreshToken) {
        throw new InvalidRefreshTokenError();
    }

    let payload;
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        throw new InvalidRefreshTokenError();
    }

    const prisma = await getPrisma();

    // Atomic claim so a token can only be redeemed once
    const claimed = await prisma.refreshToken.updateMany({
        where: {
            tokenHash: hashToken(refreshToken),
            userId: payload.userId,
            revokedAt: null,
            expiresAt: { gt: new Date() },
        },
        data: { revokedAt: new Date() },
    });

    if (claimed.count !== 1) {
        throw new InvalidRefreshTokenError();
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
        throw new InvalidRefreshTokenError();
    }

    return issueTokens(prisma, user);
};

module.exports = { createUser, login, refresh, revokeRefreshToken, InvalidCredentialsError, InvalidRefreshTokenError };
