/* global describe, test, expect, beforeEach, jest */

jest.mock('../config/prisma');
jest.mock('../modules/auth/token.service');

const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');
const { verifyAccessToken } = require('../modules/auth/token.service');

describe('Favorites API', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        verifyAccessToken.mockReturnValue({
            userId: 'owner-1',
        });
    });

    describe('POST /api/favorites', () => {
        test('authenticated user can create a favorite list', async () => {
            const createdList = {
                id: 'list-1',
                name: 'Weekend watchlist',
                isPublic: false,
                userId: 'owner-1',
                createdAt: new Date(),
                items: [],
            };

            getPrisma.mockResolvedValue({
                favoriteList: {
                    create: jest.fn().mockResolvedValue(createdList),
                },
            });

            const response = await request(app)
                .post('/api/favorites')
                .set('Authorization', 'Bearer test-token')
                .send({ name: 'Weekend watchlist' });

            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Weekend watchlist');
            expect(response.body.userId).toBe('owner-1');
        });

        test('returns 400 when list name is missing', async () => {
            const response = await request(app)
                .post('/api/favorites')
                .set('Authorization', 'Bearer test-token')
                .send({});

            expect(response.status).toBe(400);
        });

        test('returns 401 without access token', async () => {
            const response = await request(app)
                .post('/api/favorites')
                .send({ name: 'Weekend watchlist' });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/favorites', () => {
        test('returns the authenticated user favorite lists', async () => {
            const lists = [
                { id: 'list-1', name: 'Weekend watchlist', userId: 'owner-1', items: [] },
                { id: 'list-2', name: 'Classics', userId: 'owner-1', items: [] },
            ];

            getPrisma.mockResolvedValue({
                favoriteList: {
                    findMany: jest.fn().mockResolvedValue(lists),
                },
            });

            const response = await request(app)
                .get('/api/favorites')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });
    });

    describe('GET /api/favorites/:id', () => {
        test('owner can view their own list', async () => {
            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'list-1',
                        name: 'Weekend watchlist',
                        userId: 'owner-1',
                        isPublic: false,
                        items: [],
                    }),
                },
            });

            const response = await request(app)
                .get('/api/favorites/list-1')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(200);
            expect(response.body.id).toBe('list-1');
        });

        test('anyone can view a public list', async () => {
            verifyAccessToken.mockReturnValue({ userId: 'other-1' });

            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'list-1',
                        name: 'Weekend watchlist',
                        userId: 'owner-1',
                        isPublic: true,
                        items: [],
                    }),
                },
            });

            const response = await request(app)
                .get('/api/favorites/list-1')
                .set('Authorization', 'Bearer other-token');

            expect(response.status).toBe(200);
        });

        test('non-owner cannot view a private list', async () => {
            verifyAccessToken.mockReturnValue({ userId: 'other-1' });

            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'list-1',
                        name: 'Weekend watchlist',
                        userId: 'owner-1',
                        isPublic: false,
                        items: [],
                    }),
                },
            });

            const response = await request(app)
                .get('/api/favorites/list-1')
                .set('Authorization', 'Bearer other-token');

            expect(response.status).toBe(403);
        });

        test('returns 404 when list does not exist', async () => {
            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue(null),
                },
            });

            const response = await request(app)
                .get('/api/favorites/non-existent')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/favorites/:id/items', () => {
        test('owner can add a movie to their list', async () => {
            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'list-1',
                        userId: 'owner-1',
                    }),
                },
                movie: {
                    findUnique: jest.fn().mockResolvedValue({ id: 'movie-1' }),
                },
                favoriteItem: {
                    create: jest.fn().mockResolvedValue({
                        id: 'item-1',
                        favoriteListId: 'list-1',
                        movieId: 'movie-1',
                    }),
                },
            });

            const response = await request(app)
                .post('/api/favorites/list-1/items')
                .set('Authorization', 'Bearer test-token')
                .send({ movieId: 'movie-1' });

            expect(response.status).toBe(201);
            expect(response.body.movieId).toBe('movie-1');
        });

        test('returns 400 when movieId is missing', async () => {
            const response = await request(app)
                .post('/api/favorites/list-1/items')
                .set('Authorization', 'Bearer test-token')
                .send({});

            expect(response.status).toBe(400);
        });

        test('returns 404 when the movie does not exist', async () => {
            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'list-1',
                        userId: 'owner-1',
                    }),
                },
                movie: {
                    findUnique: jest.fn().mockResolvedValue(null),
                },
            });

            const response = await request(app)
                .post('/api/favorites/list-1/items')
                .set('Authorization', 'Bearer test-token')
                .send({ movieId: 'non-existent' });

            expect(response.status).toBe(404);
        });

        test('non-owner cannot add a movie to another user list', async () => {
            verifyAccessToken.mockReturnValue({ userId: 'other-1' });

            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'list-1',
                        userId: 'owner-1',
                    }),
                },
            });

            const response = await request(app)
                .post('/api/favorites/list-1/items')
                .set('Authorization', 'Bearer other-token')
                .send({ movieId: 'movie-1' });

            expect(response.status).toBe(403);
        });

        test('returns 409 when the movie is already in the list', async () => {
            const duplicateError = new Error('Unique constraint failed');
            duplicateError.code = 'P2002';

            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'list-1',
                        userId: 'owner-1',
                    }),
                },
                movie: {
                    findUnique: jest.fn().mockResolvedValue({ id: 'movie-1' }),
                },
                favoriteItem: {
                    create: jest.fn().mockRejectedValue(duplicateError),
                },
            });

            const response = await request(app)
                .post('/api/favorites/list-1/items')
                .set('Authorization', 'Bearer test-token')
                .send({ movieId: 'movie-1' });

            expect(response.status).toBe(409);
        });
    });

    describe('DELETE /api/favorites/:id/items/:movieId', () => {
        test('owner can remove a movie from their list', async () => {
            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'list-1',
                        userId: 'owner-1',
                    }),
                },
                favoriteItem: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'item-1',
                        favoriteListId: 'list-1',
                        movieId: 'movie-1',
                    }),
                    delete: jest.fn().mockResolvedValue({}),
                },
            });

            const response = await request(app)
                .delete('/api/favorites/list-1/items/movie-1')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(204);
        });
    });

    describe('DELETE /api/favorites/:id', () => {
        test('owner can delete their favorite list', async () => {
            getPrisma.mockResolvedValue({
                favoriteList: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'list-1',
                        userId: 'owner-1',
                    }),
                    delete: jest.fn().mockResolvedValue({}),
                },
            });

            const response = await request(app)
                .delete('/api/favorites/list-1')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(204);
        });
    });
});
