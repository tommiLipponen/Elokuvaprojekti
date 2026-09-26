const express = require('express');
const authMiddleware = require('../auth/auth.middleware');

const {
    create,
    list,
    update,
} = require('./memberships.controller');

const router = express.Router();

/**
 * @swagger
 * /groups/{id}/join-requests:
 *   post:
 *     summary: Request to join a group
 *     description: Sends a join request for the authenticated user.
 *     tags:
 *       - Memberships
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Join request created
 *       400:
 *         description: Join request already exists or request is invalid
 *       401:
 *         description: Access token required or invalid
 *       404:
 *         description: Group not found
 *       500:
 *         description: Failed to create join request
 *
 *   get:
 *     summary: Get group join requests
 *     description: Returns join requests for a group. Only the group owner can access them.
 *     tags:
 *       - Memberships
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of join requests
 *       401:
 *         description: Access token required or invalid
 *       403:
 *         description: Only the group owner can view join requests
 *       404:
 *         description: Group not found
 *       500:
 *         description: Failed to get join requests
 */
router.post('/:id/join-requests', authMiddleware, create);
router.get('/:id/join-requests', authMiddleware, list);

/**
 * @swagger
 * /groups/{id}/join-requests/{userId}:
 *   patch:
 *     summary: Approve or reject a join request
 *     description: Allows the group owner to approve or reject a pending join request.
 *     tags:
 *       - Memberships
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Group ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID of the join requester
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - APPROVED
 *                   - REJECTED
 *                 example: APPROVED
 *     responses:
 *       200:
 *         description: Join request updated successfully
 *       400:
 *         description: Invalid status or join request is not pending
 *       401:
 *         description: Access token required or invalid
 *       403:
 *         description: Only the group owner can approve or reject requests
 *       404:
 *         description: Group or join request not found
 *       500:
 *         description: Failed to update join request
 */

router.patch('/:id/join-requests/:userId', authMiddleware, update);

module.exports = router;