/* global describe, test, expect, beforeEach, jest */

jest.mock('../config/prisma');
jest.mock('../modules/auth/token.service');

const request = require('supertest');
const app = require('../app');
const { getPrisma } = require('../config/prisma');
const { verifyAccessToken } = require('../modules/auth/token.service');

describe('Memberships API', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        verifyAccessToken.mockReturnValue({
            userId: 'user-1',
        });
    });

    describe('POST /api/groups/:id/join-requests', () => {
        test('authenticated user can send a join request', async () => {
            const membership = {
                id: 'membership-1',
                groupId: 'group-1',
                userId: 'user-1',
                status: 'PENDING',
            };

            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                    }),
                },
                groupMembership: {
                    findUnique: jest.fn().mockResolvedValue(null),
                    create: jest.fn().mockResolvedValue(membership),
                },
            });

            const response = await request(app)
                .post('/api/groups/group-1/join-requests')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(201);
            expect(response.body.groupId).toBe('group-1');
            expect(response.body.userId).toBe('user-1');
            expect(response.body.status).toBe('PENDING');
        });

        test('returns 404 when group does not exist', async () => {
            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue(null),
                },
            });

            const response = await request(app)
                .post('/api/groups/non-existent/join-requests')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(404);
        });

        test('returns 400 when user is already an approved member', async () => {
            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                    }),
                },
                groupMembership: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'membership-1',
                        groupId: 'group-1',
                        userId: 'user-1',
                        status: 'APPROVED',
                    }),
                },
            });

            const response = await request(app)
                .post('/api/groups/group-1/join-requests')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                'User is already a member of this group'
            );
        });

        test('returns 400 when a pending join request already exists', async () => {
            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                    }),
                },
                groupMembership: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'membership-1',
                        groupId: 'group-1',
                        userId: 'user-1',
                        status: 'PENDING',
                    }),
                },
            });

            const response = await request(app)
                .post('/api/groups/group-1/join-requests')
                .set('Authorization', 'Bearer test-token');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                'Join request already exists'
            );
        });

        test('owner cannot request to join their own group', async () => {
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
                },
            });

            const response = await request(app)
                .post('/api/groups/group-1/join-requests')
                .set('Authorization', 'Bearer owner-token');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                'User is already a member of this group'
            );
        });

        test('returns 401 without access token', async () => {
            const response = await request(app)
                .post('/api/groups/group-1/join-requests');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/groups/:id/join-requests', () => {
        test('owner can view pending join requests', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'owner-1',
            });

            const requests = [
                {
                    id: 'membership-1',
                    groupId: 'group-1',
                    userId: 'user-1',
                    status: 'PENDING',
                    user: {
                        id: 'user-1',
                        username: 'testuser',
                        email: 'test@example.com',
                    },
                },
            ];

            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                    }),
                },
                groupMembership: {
                    findMany: jest.fn().mockResolvedValue(requests),
                },
            });

            const response = await request(app)
                .get('/api/groups/group-1/join-requests')
                .set('Authorization', 'Bearer owner-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].userId).toBe('user-1');
            expect(response.body[0].status).toBe('PENDING');
        });

        test('non-owner cannot view join requests', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'user-1',
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
                .get('/api/groups/group-1/join-requests')
                .set('Authorization', 'Bearer user-token');

            expect(response.status).toBe(403);
            expect(response.body.message).toBe(
                'To view join requests, you need to be the group owner'
            );
        });

        test('returns 404 when group does not exist', async () => {
            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue(null),
                },
            });

            const response = await request(app)
                .get('/api/groups/non-existent/join-requests')
                .set('Authorization', 'Bearer owner-token');

            expect(response.status).toBe(404);
        });

        test('returns 401 without access token', async () => {
            const response = await request(app)
                .get('/api/groups/group-1/join-requests');

            expect(response.status).toBe(401);
        });
    });

    describe('PATCH /api/groups/:id/join-requests/:userId', () => {
        test('owner can approve a pending join request', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'owner-1',
            });

            const updatedMembership = {
                id: 'membership-1',
                groupId: 'group-1',
                userId: 'user-1',
                status: 'APPROVED',
            };

            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                    }),
                },
                groupMembership: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'membership-1',
                        groupId: 'group-1',
                        userId: 'user-1',
                        status: 'PENDING',
                    }),
                    update: jest.fn().mockResolvedValue(updatedMembership),
                },
            });

            const response = await request(app)
                .patch('/api/groups/group-1/join-requests/user-1')
                .set('Authorization', 'Bearer owner-token')
                .send({
                    status: 'APPROVED',
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('APPROVED');
        });

        test('owner can reject a pending join request', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'owner-1',
            });

            const updatedMembership = {
                id: 'membership-1',
                groupId: 'group-1',
                userId: 'user-1',
                status: 'REJECTED',
            };

            getPrisma.mockResolvedValue({
                group: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'group-1',
                        name: 'Friday Movie Club',
                        ownerId: 'owner-1',
                    }),
                },
                groupMembership: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'membership-1',
                        groupId: 'group-1',
                        userId: 'user-1',
                        status: 'PENDING',
                    }),
                    update: jest.fn().mockResolvedValue(updatedMembership),
                },
            });

            const response = await request(app)
                .patch('/api/groups/group-1/join-requests/user-1')
                .set('Authorization', 'Bearer owner-token')
                .send({
                    status: 'REJECTED',
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('REJECTED');
        });

        test('non-owner cannot approve or reject a request', async () => {
            verifyAccessToken.mockReturnValue({
                userId: 'user-2',
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
                .patch('/api/groups/group-1/join-requests/user-1')
                .set('Authorization', 'Bearer user-token')
                .send({
                    status: 'APPROVED',
                });

            expect(response.status).toBe(403);
        });

        test('returns 400 for an invalid status', async () => {
            const response = await request(app)
                .patch('/api/groups/group-1/join-requests/user-1')
                .set('Authorization', 'Bearer owner-token')
                .send({
                    status: 'INVALID',
                });

            expect(response.status).toBe(400);
        });

        test('returns 404 when join request does not exist', async () => {
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
                },
                groupMembership: {
                    findUnique: jest.fn().mockResolvedValue(null),
                },
            });

            const response = await request(app)
                .patch('/api/groups/group-1/join-requests/user-1')
                .set('Authorization', 'Bearer owner-token')
                .send({
                    status: 'APPROVED',
                });

            expect(response.status).toBe(404);
        });

        test('returns 400 when join request is not pending', async () => {
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
                },
                groupMembership: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 'membership-1',
                        groupId: 'group-1',
                        userId: 'user-1',
                        status: 'APPROVED',
                    }),
                },
            });

            const response = await request(app)
                .patch('/api/groups/group-1/join-requests/user-1')
                .set('Authorization', 'Bearer owner-token')
                .send({
                    status: 'REJECTED',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                'Join request is not pending'
            );
        });

        test('returns 401 without access token', async () => {
            const response = await request(app)
                .patch('/api/groups/group-1/join-requests/user-1')
                .send({
                    status: 'APPROVED',
                });

            expect(response.status).toBe(401);
        });
    });
});