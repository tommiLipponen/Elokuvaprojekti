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
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: cmtuffel0000058vqeg6pzxhr
 *                 email:
 *                   type: string
 *                   example: test@example.com
 *                 username:
 *                   type: string
 *                   example: test
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: Invalid email format
 *                     password:
 *                       type: string
 *                       example: Password must be at least 8 characters long, contain one uppercase letter and one number
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: Email already registered
 */

// Define the /register route and associate it with the register controller function
router.post('/register', register);

module.exports = router;