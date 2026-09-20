/* global afterAll, describe, test, expect */

const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');

describe('POST /auth/register', () => {
  afterAll(async () => {
    const prisma = await getPrisma();
    await prisma.$disconnect();
  });

  test('registers a user with valid credentials', async () => {
    const email = `register-${Date.now()}@example.com`;

    const response = await request(app)
      .post('/auth/register')
      .send({ email, password: 'ValidPassword123' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        email,
        username: email.split('@')[0],
      }),
    );
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  test('rejects an invalid password', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'valid@example.com', password: 'short' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors.password).toBeDefined();
  });

  test('rejects an invalid email', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'invalid-email', password: 'ValidPassword123' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors.email).toBe('Invalid email format');
  });
});