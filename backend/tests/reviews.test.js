/* global describe, test, expect, beforeEach, jest */

jest.mock('../config/prisma'); 
jest.mock('../modules/auth/token.service');
jest.mock('../modules/movies/movies.import.service');

const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');
const { verifyAccessToken } = require('../modules/auth/token.service');
const { importMovieByTmdbId } = require('../modules/movies/movies.import.service');

describe('Reviews API', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        verifyAccessToken.mockReturnValue({
            userId: 'user-1',
        });
    });

    describe('POST /movies/:id/reviews', () => {
        test('authenticated user can create a review', async () => {
            const createdReview = {
                id: 'review-1',
                movieId: 'movie-1',
                userId: 'user-1',
                rating: 5,
                comment: 'Excellent movie',
                createdAt: new Date(),
            };

            getPrisma.mockResolvedValue({
                movie: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'movie-1',
                    }),
                },
                review: {
                    create: jest.fn().mockResolvedValue(createdReview),
                },
            });

            const response = await request(app)
                .post('/movies/movie-1/reviews')
                .set('Authorization', 'Bearer test-token')
                .send({
                    rating: 5,
                    comment: 'Excellent movie',
                });

            expect(response.status).toBe(201);
            expect(response.body.id).toBe('review-1');
            expect(response.body.movieId).toBe('movie-1');
            expect(response.body.userId).toBe('user-1');
            expect(response.body.rating).toBe(5);
            expect(response.body.comment).toBe('Excellent movie');
        });

        test('returns 400 when rating is missing', async () => {
            const response = await request(app)
                .post('/movies/movie-1/reviews')
                .set('Authorization', 'Bearer test-token')
                .send({
                    comment: 'Good movie',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                'Rating must be an integer between 1 and 5'
            );
        });

        test('returns 400 when rating is outside the range 1 to 5', async () => {
            const response = await request(app)
                .post('/movies/movie-1/reviews')
                .set('Authorization', 'Bearer test-token')
                .send({
                    rating: 6,
                    comment: 'Good movie',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                'Rating must be an integer between 1 and 5'
            );
        });

        test('returns 400 when comment is empty', async () => {
            const response = await request(app)
                .post('/movies/movie-1/reviews')
                .set('Authorization', 'Bearer test-token')
                .send({
                    rating: 4,
                    comment: '   ',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Comment cannot be empty');
        });

        test('returns 404 when movie does not exist', async () => {
            getPrisma.mockResolvedValue({
                movie: {
                    findUnique: jest.fn().mockResolvedValue(null),
                },
            });

            const response = await request(app)
                .post('/movies/non-existent/reviews')
                .set('Authorization', 'Bearer test-token')
                .send({
                    rating: 4,
                    comment: 'Good movie',
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Movie not found');
        });

        test('returns 401 without an access token', async () => {
            const response = await request(app)
                .post('/movies/movie-1/reviews')
                .send({
                    rating: 5,
                    comment: 'Excellent movie',
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /movies/:id/reviews', () => {
        test('returns reviews without login', async () => {
            getPrisma.mockResolvedValue({
                review: {
                    findMany: jest.fn().mockResolvedValue([]),
                },
            });
            const response = await request(app)
                .get('/movies/movie-1/reviews');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        test('returns review details including username', async () => {
            getPrisma.mockResolvedValue({
                review: {
                    findMany: jest.fn().mockResolvedValue([
                        {
                            id: 'review-1',
                            rating: 5,
                            comment: 'Excellent movie',
                            createdAt: new Date(),
                            user: {
                                username: 'testuser',
                            },
                        },
                    ]),
                },
            });
            const response = await request(app)
                .get('/movies/movie-1/reviews');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    id: 'review-1',
                    username: 'testuser',
                    rating: 5,
                    comment: 'Excellent movie',
                    createdAt: expect.any(String),
                },
            ]);
        });

        test('queries newest reviews first and only exposes safe fields', async () => {
            const findMany = jest.fn().mockResolvedValue([]);
            getPrisma.mockResolvedValue({ review: { findMany } });

            await request(app).get('/movies/movie-1/reviews');

            expect(findMany).toHaveBeenCalledWith({
                where: { movieId: 'movie-1' },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    user: { select: { username: true } },
                },
            });
        });

        test('resolves a numeric TMDB id to the stored movie', async () => {
            const findMany = jest.fn().mockResolvedValue([]);
            getPrisma.mockResolvedValue({
                movie: {
                    findUnique: jest.fn().mockResolvedValue({ id: 'movie-db-1' }),
                },
                review: { findMany },
            });

            const response = await request(app).get('/movies/1423191/reviews');

            expect(response.status).toBe(200);
            expect(findMany.mock.calls[0][0].where).toEqual({ movieId: 'movie-db-1' });
            expect(importMovieByTmdbId).not.toHaveBeenCalled();
        });

        test('imports an unknown TMDB movie on demand and returns its empty reviews', async () => {
            const findMany = jest.fn().mockResolvedValue([]);
            getPrisma.mockResolvedValue({
                movie: { findUnique: jest.fn().mockResolvedValue(null) },
                review: { findMany },
            });
            importMovieByTmdbId.mockResolvedValue({ id: 'movie-imported' });

            const response = await request(app).get('/movies/1576/reviews');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
            expect(findMany.mock.calls[0][0].where).toEqual({ movieId: 'movie-imported' });
        });

        test('returns an empty list for an unknown movie when TMDB import fails', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            getPrisma.mockResolvedValue({
                movie: { findUnique: jest.fn().mockResolvedValue(null) },
                review: { findMany: jest.fn().mockResolvedValue([]) },
            });
            importMovieByTmdbId.mockRejectedValue(new Error('TMDB down'));

            const response = await request(app).get('/movies/999999999/reviews');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
            console.error.mockRestore();
        });

        test('returns 500 when the database fails', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            getPrisma.mockResolvedValue({
                review: {
                    findMany: jest.fn().mockRejectedValue(new Error('db error')),
                },
            });

            const response = await request(app).get('/movies/movie-1/reviews');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Failed to get reviews' });
            console.error.mockRestore();
        });
    });

});
