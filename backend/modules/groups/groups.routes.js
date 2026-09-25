const express = require('express');
const authMiddleware = require('../auth/auth.middleware');
const {
    create,
    list,
    getById,
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
 *     description: Creates a new group owned by the authenticated user. Use the Bearer access token obtained from POST /auth/login.
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
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
 * /groups/{id}:
 *   get:
 *     summary: Get a group by id
 *     description: Returns a single group. Requires the authenticated user to be the owner or an approved member.
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
 *         description: Not a member of this group
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

router.get('/mine', authMiddleware, listMyGroups);

router.get('/:id', authMiddleware, getById);
router.post('/:id/movies', authMiddleware, addMovie);
router.delete('/:id', authMiddleware, remove);

module.exports = router;