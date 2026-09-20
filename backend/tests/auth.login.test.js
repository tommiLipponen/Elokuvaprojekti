/* global afterAll, beforeAll, describe, test, expect */

const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');

describe('POST /auth/login', () => {
  const password = 'ValidPassword123';
  let credentials;

  beforeAll(async () => {
    credentials = { email: `login-${Date.now()}@example.com`, password };
    const response = await request(app).post('/auth/register').send(credentials);
    expect(response.statusCode).toBe(201);
  });

  afterAll(async () => {
    const prisma = await getPrisma();
    await prisma.$disconnect();
  });

  test('logs in with valid credentials', async () => {
    const response = await request(app).post('/auth/login').send(credentials);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      user: expect.objectContaining({ email: credentials.email }),
    }));
  });

  test('rejects invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: credentials.email, password: 'WrongPassword123' });

    expect(response.statusCode).toBe(401);
    expect(response.body.errors.message).toBe('Invalid email or password');
  });
});