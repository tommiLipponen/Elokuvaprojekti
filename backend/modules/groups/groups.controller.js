const {
    createGroup,
    getGroups,
    getGroupById,
    deleteGroup,
} = require('./groups.service');

const { validateGroupName } = require('./groups.validation');

const create = async (req, res) => {
    try {
        const { name } = req.body;

        const validationError = validateGroupName(name);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        
        const group = await createGroup(name, req.user.id);
        
        res.status(201).json(group);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Failed to create group' });
    }
};

const list = async (req, res) => {
    try {
        const groups = await getGroups();
        
        res.status(200).json(groups);
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({ message: 'Failed to get groups' });
    }
};

const getById = async (req, res) => {
    try {
        const group = await getGroupById(
            req.params.id,
            req.user.userId
        );

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.accessDenied) {
            return res.status(403).json({ message: 'To view this group, you need to be a member' });
        }

        return res.status(200).json(group);
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Failed to get group' });
    }
};

const remove = async (req, res) => {
    try {
        const group = await deleteGroup(
            req.params.id,
            req.user.userId
        );

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.accessDenied) {
            return res.status(403).json({ message: 'To delete this group, you need to be the owner' });
        }

        return re.status(204).send();
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Failed to delete group' });
    }
};

module.exports = {
    create,
    list,
    getById,
    remove,
};