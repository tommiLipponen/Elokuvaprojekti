const express = require('express');
const authMiddleware = require('../auth/auth.middleware');
const {
    create,
    list,
    getById,
    remove,
} = require('./groups.controller');

const router = express.Router();

router.get('/', list);
router.post('/', authMiddleware, create);
router.get('/:id', authMiddleware, getById);
router.delete('/:id', authMiddleware, remove);

module.exports = router;