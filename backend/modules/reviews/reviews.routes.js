const express = require('express');
const authMiddleware = require('../auth/auth.middleware');
const { createReviewHandler } = require('./reviews.controller');

const router = express.Router();

/**
 * @swagger
 * /movies/{id}/reviews:
 *   post:
 *     summary: Create a movie review
 *     description: Creates an authenticated user's review for a movie.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie database ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, comment]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 minLength: 1
 *                 example: Excellent movie
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Invalid rating or empty comment
 *       401:
 *         description: Access token required or invalid
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Failed to create review
 */
router.post('/:id/reviews', authMiddleware, createReviewHandler);

module.exports = router;