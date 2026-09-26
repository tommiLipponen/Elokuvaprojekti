/* global describe, test, expect, beforeEach, jest */

jest.mock('../config/prisma'); 
jest.mock('../modules/auth/token.service');

const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');
const { verifyAccessToken } = require('../modules/auth/token.service');

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
});