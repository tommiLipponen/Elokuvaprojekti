/* global describe, test, expect, jest */

jest.mock('../config/prisma');
jest.mock('bcrypt');
jest.mock('../modules/auth/token.service');

const bcrypt = require('bcrypt');
const { getPrisma } = require('../config/prisma');
const { generateAccessToken, generateRefreshToken } = require('../modules/auth/token.service');
const { login } = require('../modules/auth/auth.service');

describe('auth.service.login', () => {
  test('returns tokens and a safe user object (no passwordHash)', async () => {
    getPrisma.mockResolvedValue({
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'test@example.com',
          username: 'test',
          passwordHash: 'hashed',
        }),
      },
    });
    bcrypt.compare.mockResolvedValue(true);
    generateAccessToken.mockReturnValue('access-token');
    generateRefreshToken.mockReturnValue('refresh-token');

    const result = await login('test@example.com', 'Password123');

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: 'user-1', email: 'test@example.com', username: 'test' },
    });
  });

  test('throws when the password is invalid', async () => {
    getPrisma.mockResolvedValue({
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'test@example.com',
          username: 'test',
          passwordHash: 'hashed',
        }),
      },
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(login('test@example.com', 'wrong')).rejects.toThrow('Invalid email or password');
  });
});
