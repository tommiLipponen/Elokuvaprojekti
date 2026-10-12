/* global afterAll, beforeAll, describe, test, expect */

const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');

describe('POST /auth/refresh', () => {
  let prisma;
  let credentials;

  beforeAll(async () => {
    prisma = await getPrisma();
    credentials = {
      email: `refresh-${Date.now()}@example.com`,
      password: 'ValidPassword123',
    };
    await request(app).post('/auth/register').send(credentials);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const loginTokens = async () =>
    (await request(app).post('/auth/login').send(credentials)).body;

  test('rotates the refresh token and returns new tokens', async () => {
    const { refreshToken, user } = await loginTokens();

    const response = await request(app).post('/auth/refresh').send({ refreshToken });

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.refreshToken).toEqual(expect.any(String));
    expect(response.body.user.id).toBe(user.id);
  });

  test('rejects a refresh token that was already used', async () => {
    const { refreshToken } = await loginTokens();

    await request(app).post('/auth/refresh').send({ refreshToken });
    const reuse = await request(app).post('/auth/refresh').send({ refreshToken });

    expect(reuse.statusCode).toBe(401);
  });

  test('rejects a revoked refresh token', async () => {
    const { refreshToken } = await loginTokens();

    await request(app).post('/auth/logout').send({ refreshToken });
    const response = await request(app).post('/auth/refresh').send({ refreshToken });

    expect(response.statusCode).toBe(401);
  });

  test('rejects missing and malformed tokens', async () => {
    expect((await request(app).post('/auth/refresh').send({})).statusCode).toBe(401);
    expect(
      (await request(app).post('/auth/refresh').send({ refreshToken: 'garbage' })).statusCode,
    ).toBe(401);
  });
});
