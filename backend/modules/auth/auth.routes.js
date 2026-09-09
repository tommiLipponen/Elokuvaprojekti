import express from 'express';
import { register } from './auth.controller.js';

const router = express.Router();

// Define the /register route and associate it with the register controller function
router.post('/register', register);

export default router;