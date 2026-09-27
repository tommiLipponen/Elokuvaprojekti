const express = require('express');
const authMiddleware = require('../auth/auth.middleware');
const {
    create,
    list,
    getById,
    remove,
    addItem,
    removeItem,
} = require('./favorites.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorite movie lists and their items
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: List the authenticated user's favorite lists
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FavoriteList'
 *       401:
 *         description: Access token required or invalid
 *       500:
 *         description: Failed to get favorite lists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 *   post:
 *     summary: Create a favorite list
 *     description: Creates a new favorite list owned by the authenticated user.
 *     tags: [Favorites]
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
 *                 example: Weekend watchlist
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Favorite list created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteList'
 *       400:
 *         description: Invalid or missing list name
 *       401:
 *         description: Access token required or invalid
 *       500:
 *         description: Failed to create favorite list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/', authMiddleware, list);
router.post('/', authMiddleware, create);

/**
 * @swagger
 * /favorites/{id}:
 *   get:
 *     summary: Get a favorite list by id
 *     description: Returns a favorite list with its items. Requires the authenticated user to be the owner, unless the list is public.
 *     tags: [Favorites]
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
 *         description: The requested favorite list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteList'
 *       401:
 *         description: Access token required or invalid
 *       403:
 *         description: Not the owner of this favorite list
 *       404:
 *         description: Favorite list not found
 *       500:
 *         description: Failed to get favorite list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 *   delete:
 *     summary: Delete a favorite list
 *     description: Deletes a favorite list. Requires the authenticated user to be the owner.
 *     tags: [Favorites]
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
 *         description: Favorite list successfully deleted
 *       401:
 *         description: Access token required or invalid
 *       403:
 *         description: Not the owner of this favorite list
 *       404:
 *         description: Favorite list not found
 *       500:
 *         description: Failed to delete favorite list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/:id', authMiddleware, getById);
router.delete('/:id', authMiddleware, remove);

/**
 * @swagger
 * /favorites/{id}/items:
 *   post:
 *     summary: Add a movie to a favorite list
 *     description: Requires the authenticated user to be the owner of the favorite list.
 *     tags: [Favorites]
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
 *             required: [movieId]
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: e1a2b3d4-e5f6-7890-abcd-ef1234567890
 *     responses:
 *       201:
 *         description: Movie added to the favorite list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteItem'
 *       400:
 *         description: Invalid or missing movie id
 *       401:
 *         description: Access token required or invalid
 *       403:
 *         description: Not the owner of this favorite list
 *       404:
 *         description: Favorite list or movie not found
 *       409:
 *         description: Movie is already in the favorite list
 *       500:
 *         description: Failed to add movie to favorite list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post('/:id/items', authMiddleware, addItem);

/**
 * @swagger
 * /favorites/{id}/items/{movieId}:
 *   delete:
 *     summary: Remove a movie from a favorite list
 *     description: Requires the authenticated user to be the owner of the favorite list.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Movie successfully removed from the favorite list
 *       401:
 *         description: Access token required or invalid
 *       403:
 *         description: Not the owner of this favorite list
 *       404:
 *         description: Favorite list or item not found
 *       500:
 *         description: Failed to remove movie from favorite list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.delete('/:id/items/:movieId', authMiddleware, removeItem);

module.exports = router;
