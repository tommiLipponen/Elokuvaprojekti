const express = require('express');
const { register } = require('./auth.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration and authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email and password. The password must contain at least 8 characters, one uppercase letter, and one number.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 description: At least 8 characters, one uppercase letter and one number
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique user identifier (CUID)
 *                   example: cmtuffel0000058vqeg6pzxhr
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: test@example.com
 *                 username:
 *                   type: string
 *                   description: Derived from email (part before @)
 *                   example: test
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-09-13T14:30:00Z
 *       400:
 *         description: Invalid request - validation errors on email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       409:
 *         description: Email already registered - unique constraint violation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */

// Define the /register route and associate it with the register controller function
router.post('/register', register);

module.exports = router;