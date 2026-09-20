/* global afterAll, beforeAll, describe, test, expect */

const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');

describe('DELETE /users/me', () => {
  let prisma;
  let accessToken;
  let userId;

  beforeAll(async () => {
    prisma = await getPrisma();
    const credentials = {
      email: `delete-${Date.now()}@example.com`,
      password: 'ValidPassword123',
    };
    const registrationResponse = await request(app)
      .post('/auth/register')
      .send(credentials);
    userId = registrationResponse.body.id;
    const loginResponse = await request(app).post('/auth/login').send(credentials);
    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('deletes the authenticated user account', async () => {
    const response = await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);
    expect(await prisma.user.findUnique({ where: { id: userId } })).toBeNull();
  });
});