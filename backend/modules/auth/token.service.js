const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getPrisma } = require('../../config/prisma');

// Fails clearly at token creation instead of a cryptic jsonwebtoken error deep in the stack
const getRequiredEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not set`);
    }
    return value;
};

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        getRequiredEnv('JWT_SECRET'),
        { expiresIn: '20min' }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        getRequiredEnv('JWT_REFRESH_SECRET'),
        { expiresIn: '7d' }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const revokeRefreshToken = async (token) => {
    const prisma = await getPrisma();

    const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

    await prisma.refreshToken.update({
        where: { 
            tokenHash 
        },
        data: {
            revokedAt: new Date(),
        },
    });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    revokeRefreshToken,
};