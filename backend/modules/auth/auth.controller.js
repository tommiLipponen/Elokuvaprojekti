const { validateAuth } = require('./auth.validation');
const { createUser } = require('./auth.service');
const { login, revokeRefreshToken } = require('./auth.service');


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

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const tokens = await login(email, password);
// If login is successful, return the access and refresh tokens
    return res.status(200).json(tokens);
  } catch (err) {
// If login fails (invalid email or password), return a 401 Unauthorized response with an error message
    return res.status(401).json({ errors: { message: 'Invalid email or password' } });
  }
};

const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    await revokeRefreshToken(refreshToken);
// If the refresh token is successfully revoked, return a 204 No Content response
    return res.status(204).send();
  } catch (err) {
// If the refresh token is not found, return a 404 Not Found response with an error message
    return res.status(404).json({ errors: { message: 'Refresh token not found' } });
  }
};


module.exports = { register, loginUser, logoutUser };