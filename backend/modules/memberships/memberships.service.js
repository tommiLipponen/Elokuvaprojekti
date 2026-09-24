const { getPrisma } = require('../../config/prisma');

const createJoinRequest = async (groupId, userId) => {
    const prisma = await getPrisma();

    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
    });

    if (!group) {
        return null;
    }

    // Owner does not need to request to join their own group.

    if (group.ownerId === userId) {
        return {
            alreadyMember: true,
        };
    }

    const existingMembership = await prisma.groupMembership.findUnique({
        where: {
            groupId_userId: {
                groupId,
                userId,
            },
        },
    });

    if (existingMembership) {
        if (existingMembership.status === 'APPROVED') {
            return {
                alreadyMember: true,
            };
        }

        if (existingMembership.status === 'PENDING') {
            return {
                requestPending: true,
            };
        }

        if (existingMembership.status === 'REJECTED') {
            const membership = await prisma.groupMembership.update({
                where: {
                    groupId_userId: {
                        groupId,
                        userId,
                    },
                },
                data: {
                    status: 'PENDING',
                    joinedAt: new Date(),
                },
            });

            return membership;
        }
    }

    const membership = await prisma.groupMembership.create({
        data: {
            groupId,
            userId,
            status: 'PENDING',
        },
    });

    return membership;

};

const getJoinRequests = async (groupId, userId) => {
    const prisma = await getPrisma();

    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
    });

    if (!group) {
        return null;
    }

    if (group.ownerId !== userId) {
        return {
            accessDenied: true,
        };
    }

    const requests = await prisma.groupMembership.findMany({
        where: {
            groupId,
            status: 'PENDING',
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            },
        },
    });

    return requests;

};

const updateJoinRequest = async (
    groupId,
    ownerId,
    requesterId,
    status
) => {

    const prisma = await getPrisma();

    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
    });

    if (!group) {
        return null;
    }

    if (group.ownerId !== ownerId) {
        return {
            accessDenied: true,
        };
    }

    const membership = await prisma.groupMembership.findUnique({
        where: {
            groupId_userId: {
                groupId,
                userId: requesterId,
            },
        },
    });

    if (!membership) {
        return null;
    }

    if (membership.status !== 'PENDING') {
        return {
            invalidRequest: true,
        };
    }

    const updatedMembership = await prisma.groupMembership.update({
        where: {
            groupId_userId: {
                groupId,
                userId: requesterId,
            },
        },
        data: {
            status,
        },
    });

    return updatedMembership;

};

module.exports = {
    createJoinRequest,
    getJoinRequests,
    updateJoinRequest,
};