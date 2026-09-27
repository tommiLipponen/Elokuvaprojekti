const {
    createJoinRequest,
    getJoinRequests,
    updateJoinRequest,
    removeMember,
    leaveGroup,
} = require('./memberships.service');

const {
    validateJoinRequestStatus,
} = require('./memberships.validation');

const create = async (req, res) => {
    try {
        const membership = await createJoinRequest(
            req.params.id,
            req.user.userId
        );

        if (!membership) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (membership.alreadyMember) {
            return res.status(400).json({ message: 'User is already a member of this group' });
        }

        if (membership.requestPending) {
            return res.status(400).json({ message: 'Join request already exists' });
        }

        return res.status(201).json(membership);
    } catch (error) { console.error(error); return res.status(500).json({ message: 'Failed to create join request' }); }
};

const list = async (req, res) => {
    try {
        const requests = await getJoinRequests(
            req.params.id,
            req.user.userId
        );

        if (!requests) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (requests.accessDenied) {
            return res.status(403).json({
                message: 'To view join requests, you need to be the group owner',
            });
        }

        return res.status(200).json(requests);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Failed to get join requests' });
    }

};

const update = async (req, res) => {
    try {
        const { status } = req.body;

        const validationError = validateJoinRequestStatus(status);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const membership = await updateJoinRequest(
            req.params.id,
            req.user.userId,
            req.params.userId,
            status
        );

        if (!membership) {
            return res.status(404).json({ message: 'Group or join request not found' });
        }

        if (membership.accessDenied) {
            return res.status(403).json({
                message: 'To approve or reject join requests, you need to be the group owner',
            });
        }

        if (membership.invalidRequest) {
            return res.status(400).json({
                message: 'Join request is not pending',
            });
        }
        return res.status(200).json(membership);
    } catch (error) { console.error(error); return res.status(500).json({ message: 'Failed to update join request' }); }
};

const remove = async (req, res) => {
    try {
        const result = await removeMember(
            req.params.id,
            req.user.userId,
            req.params.userId
        );

        if (!result) {
            return res.status(404).json({
                message: 'Group not found',
            });
        }

        if (result.accessDenied) {
            return res.status(403).json({
                message: 'Only the group owner can remove members',
            });
        }

        if (result.cannotRemoveOwner) {
            return res.status(400).json({
                message: 'The group owner cannot be removed',
            });
        }

        if (result.memberNotFound) {
            return res.status(404).json({
                message: 'Member not found',
            });
        }

        return res.status(204).send();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Failed to remove member',
        });
    }
};

const leave = async (req, res) => {
    try {
        const result = await leaveGroup(
            req.params.id,
            req.user.userId
        );

        if (!result) {
            return res.status(404).json({
                message: 'Group not found',
            });
        }

        if (result.ownerCannotLeave) {
            return res.status(400).json({
                message: 'The group owner cannot leave the group',
            });
        }

        if (result.memberNotFound) {
            return res.status(404).json({
                message: 'You are not a member of this group',
            });
        }

        return res.status(204).send();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Failed to leave group',
        });
    }
};

module.exports = {
    create,
    list,
    update,
    remove,
    leave,
};