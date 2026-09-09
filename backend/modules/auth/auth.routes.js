const express = require('express');
const { register } = require('./auth.controller');

const router = express.Router();

// Define the /register route and associate it with the register controller function
router.post('/register', register);

module.exports = router;