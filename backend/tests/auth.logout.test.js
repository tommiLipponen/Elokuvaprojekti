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
    const credentials = {
      email: `logout-${Date.now()}@example.com`,
      password: 'ValidPassword123',
    };
    await request(app).post('/auth/register').send(credentials);
    const loginResponse = await request(app).post('/auth/login').send(credentials);
    refreshToken = loginResponse.body.refreshToken;
    tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('invalidates the refresh token', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .send({ refreshToken });

    expect(response.statusCode).toBe(204);
    const revokedToken = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    expect(revokedToken.revokedAt).toBeInstanceOf(Date);
  });
});