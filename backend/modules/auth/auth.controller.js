const { validateAuth } = require('./auth.validation');
const { createUser } = require('./auth.service');


const register = async (req, res) => {
// Extract email and password from the request body
  const { email, password } = req.body;

// Validate the email and password using the validateAuth function
  const errors = validateAuth({ email, password });

// If there are validation errors, return a 400 Bad Request response with the errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
// If validation passes, create a new user using the createUser function
  try {
    const user = await createUser(email, password);
    return res.status(201).json(user);
  } catch (err) {
    // Prisma unique constraint violation (duplicate email/username)
    if (err.code === 'P2002') {
      return res.status(409).json({ errors: { email: 'Email already registered' } });
    }
    throw err;
  }
};

module.exports = { register };