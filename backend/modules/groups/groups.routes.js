const express = require('express');
const authMiddleware = require('../auth/auth.middleware');
const {
    create,
    list,
    getById,
    getJoinRequestStatus,
    remove,
    addMovie,
    listMyGroups,
} = require('./groups.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group creation, viewing, and deletion
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: List all groups
 *     description: Returns all groups, newest first. Works without login.
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: List of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       500:
 *         description: Failed to get groups
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 *   post:
 *     summary: Create a group
 *     description: Creates a new group owned by the authenticated user.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Friday Movie Club
 *     responses:
 *       201:
 *         description: Group created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Invalid or missing group name
 *       401:
 *         description: Access token required or invalid
 *       500:
 *         description: Failed to create group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/', list);
router.post('/', authMiddleware, create);

/**
 * @swagger
 * /groups/mine:
 *   get:
 *     summary: List my groups
 *     description: Returns groups owned by the authenticated user or groups where the user is an approved member.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       401:
 *         description: Access token required or invalid
 *       500:
 *         description: Failed to get your groups
 */
router.get('/mine', authMiddleware, listMyGroups);

/**
 * @swagger
 * /groups/{id}/join-request-status:
 *   get:
 *     summary: Check join request status
 *     description: Returns only whether the authenticated user has a pending join request. Does not reveal private group details.
 *     tags: [Groups]
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
 *         description: Join request status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - isPending
 *               properties:
 *                 isPending:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Access token required or invalid
 *       500:
 *         description: Failed to get join request status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get(
    '/:id/join-request-status',
    authMiddleware,
    getJoinRequestStatus
);

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Get a group by ID
 *     description: Returns a group only to its owner or an approved member.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       401:
 *         description: Access token required or invalid
 *       403:
 *         description: Not an approved member of this group
 *       404:
 *         description: Group not found
 *       500:
 *         description: Failed to get group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 *   delete:
 *     summary: Delete a group
 *     description: Deletes a group. Requires the authenticated user to be the group's owner.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Group successfully deleted
 *       401:
 *         description: Access token required or invalid
 *       403:
 *         description: Not the owner of this group
 *       404:
 *         description: Group not found
 *       500:
 *         description: Failed to delete group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/:id', authMiddleware, getById);

/**
 * @swagger
 * /groups/{id}/movies:
 *   post:
 *     summary: Add a movie to a group
 *     description: Adds a movie to a group. Requires the owner or an approved member.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *             properties:
 *               movieId:
 *                 type: integer
 *                 example: 550
 *     responses:
 *       201:
 *         description: Movie added to group
 *       400:
 *         description: Movie ID is required
 *       401:
 *         description: Access token required or invalid
 *       403:
 *         description: Not an approved member of this group
 *       404:
 *         description: Group or movie not found
 *       409:
 *         description: Movie is already in this group
 *       500:
 *         description: Failed to add movie to group
 */
router.post('/:id/movies', authMiddleware, addMovie);
router.delete('/:id', authMiddleware, remove);

module.exports = router;