/* global describe, test, expect */

const request = require('supertest');
const app = require('../app');

describe('API smoke test', () => {
  test('GET /api-docs returns the Swagger UI', async () => {
    const response = await request(app).get('/api-docs/');

    expect(response.statusCode).toBe(200);
  });
});
