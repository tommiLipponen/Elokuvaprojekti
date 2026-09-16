const express = require('express');
const authMiddleware = require('../modules/auth/auth.middleware');
const { deleteMe } = require('./user.controller');

const router = express.Router();

router.delete('/me', authMiddleware, deleteMe);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete current user
 *     description: Deletes the authenticated user's account and all related data. Use the Bearer access token obtained from POST /auth/login.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       401:
 *         description: Access token required or invalid
 *       500:
 *         description: Failed to delete user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.delete('/me', authMiddleware, deleteMe);



module.exports = router;
