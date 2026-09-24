/* global describe, test, expect, beforeEach, jest */

jest.mock('../config/prisma');
jest.mock('../modules/auth/token.service');

const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');
const { verifyAccessToken } = require('../modules/auth/token.service');

describe('Groups API', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        verifyAccessToken.mockReturnValue({
            userId: 'owner-1',
        });
    });

    describe('POST /api/groups', () => {
        test('authenticated user can create a group', async () => {
            const createdGroup = {
                id: 'group-1',
                name: 'Friday Movie Club',
                ownerId: 'owner-1',
                createdAt: new Date(),
            };

            getPrisma.mockResolvedValue({
                group: {
                    create: jest.fn().mockResolvedValue(createdGroup),
                },
            });

            const response = await request(app)
                .post('/api/groups')
                .set('Authorization', 'Bearer test-token')
                .send({
                    name: 'Friday Movie Club',
                });

            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Friday Movie Club');
            expect(response.body.ownerId).toBe('owner-1');
        });

        test('returns 400 when group name is missing', async () => {
            const response = await request(app)
                .post('/api/groups')
                .set('Authorization', 'Bearer test-token')
                .send({});

            expect(response.status).toBe(400);
        });

        test('returns 401 without access token', async () => {
            const response = await request(app)
                .post('/api/groups')
                .send({
                    name: 'Friday Movie Club',
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/groups', () => {
        test('returns list of groups without authentication', async () => {
            const groups = [
                {
                    id: 'group-1',
                    name: 'Friday Movie Club',
                    ownerId: 'owner-1',
                    createdAt: new Date(),
                },
                {
                    id: 'group-2',
                    name: 'Weekend Movies',
                    ownerId: 'owner-2',
                    createdAt: new Date(),
                },
            ];

            getPrisma.mockResolvedValue({
                group: {
                    findMany: jest.fn().mockResolvedValue(groups),
                },
            });

            const response = await request(app)
                .get('/api/groups');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].name).toBe('Friday Movie Club');
        });
    });

    describe('GET /api/groups/:id', () => {
        test('owner can view group details', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'owner-1',
            });

            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                        createdAt: new Date(),
                        memberships: [],
                    }),
                },
            });

            const response = await request(app)
                .get('/api/groups/group-1')
                .set('Authorization', 'Bearer owner-token');

            expect(response.status).toBe(200);
            expect(response.body.id).toBe('group-1');
        });

        test('approved member can view group details', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'member-1',
            });

            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                        createdAt: new Date(),
                        memberships: [
                            {
                                userId: 'member-1',
                                status: 'APPROVED',
                            },
                        ],
                    }),
                },
            });

            const response = await request(app)
                .get('/api/groups/group-1')
                .set('Authorization', 'Bearer member-token');

            expect(response.status).toBe(200);
        });

        test('non-member cannot view group details', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'other-1',
            });

            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                        createdAt: new Date(),
                        memberships: [],
                    }),
                },
            });

            const response = await request(app)
                .get('/api/groups/group-1')
                .set('Authorization', 'Bearer other-token');

            expect(response.status).toBe(403);
        });

        test('returns 404 when group does not exist', async () => {
            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue(null),
                },
            });

            const response = await request(app)
                .get('/api/groups/non-existent')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/groups/:id', () => {
        test('owner can delete their group', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'owner-1',
            });

            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                    }),
                    delete: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                    }),
                },
            });

            const response = await request(app)
                .delete('/api/groups/group-1')
                .set('Authorization', 'Bearer owner-token');

            expect(response.status).toBe(204);
        });

        test('non-owner cannot delete the group', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'other-1',
            });

            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                    }),
                },
            });

            const response = await request(app)
                .delete('/api/groups/group-1')
                .set('Authorization', 'Bearer other-token');

            expect(response.status).toBe(403);
        });

        test('returns 404 when group does not exist', async () => {
            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue(null),
                },
            });

            const response = await request(app)
                .delete('/api/groups/non-existent')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(404);
        });

        test('returns 401 without access token', async () => {
            const response = await request(app)
                .delete('/api/groups/group-1');

            expect(response.status).toBe(401);
        });
    });
});