const express = require('express');
const authMiddleware = require('../auth/auth.middleware');

const {
    create,
    list,
    update,
} = require('./memberships.controller');

const router = express.Router();

router.post('/:id/join-requests', authMiddleware, create);

router.get('/:id/join-requests', authMiddleware, list);

router.patch(
    '/:id/join-requests/:userId',
    authMiddleware,
    update
);

module.exports = router;