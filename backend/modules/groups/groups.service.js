const { getPrisma } = require('../../config/prisma');

const createGroup = async (name, ownerId) => {
    const prisma = await getPrisma();
    
    const group = await prisma.group.create({
        data: {
            name,
            ownerId,
        },
    });

    return group;
};

const getGroups = async () => {
    const prisma = await getPrisma();

    const groups = await prisma.group.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return groups;
};

const getGroupById = async(groupId, userId) => {
    const prisma = await getPrisma();

    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
        include: {
            memberships: true,
        },
    });

    if (!group) {
        return null;
    }

    const isOwner = group.ownerId === userId;

    const isMember = group.memberships.some(
        (memberships) => 
        memberships.userId === userId &&
        memberships.status === 'APPROVED'
    );

    if (!isOwner && !isMember) {
        return {
            accessDenied: true,
        };
    }

    return group;
};

const deleteGroup = async (groupId, userId) => {
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
    await prisma.group.delete({
        where: {
            id: groupId,
        },
    });

    return group;

};

module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    deleteGroup,
};