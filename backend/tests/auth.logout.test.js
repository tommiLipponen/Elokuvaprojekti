/* global afterAll, beforeAll, describe, test, expect */

const crypto = require('crypto');
const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');

describe('POST /auth/logout', () => {
  let prisma;
  let refreshToken;
  let tokenHash;

  beforeAll(async () => {
    prisma = await getPrisma();
    const email = `logout-${Date.now()}@example.com`;
    const password = 'ValidPassword123';

    await request(app)
      .post('/auth/register')
      .send({ email, password });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email, password });

    refreshToken = loginResponse.body.refreshToken;
    tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const user = await prisma.user.findUnique({ where: { email } });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('invalidates the refresh token', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .send({ refreshToken });

    expect(response.statusCode).toBe(204);

    const revokedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    expect(revokedToken.revokedAt.getTime()).toBeLessThanOrEqual(Date.now());
  });
});