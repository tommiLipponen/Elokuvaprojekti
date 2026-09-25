const express = require('express');
const authMiddleware = require('../auth/auth.middleware');
const { createReviewHandler } = require('./reviews.controller');

const router = express.Router();

router.post('/:id/reviews', authMiddleware, createReviewHandler);

module.exports = router;