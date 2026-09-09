import { validateAuth } from './auth.validation.js';
import { createUser } from './auth.service.js';

export const register = async (req, res) => {
// Extract email and password from the request body
  const { email, password } = req.body;

// Validate the email and password using the validateAuth function
  const errors = validateAuth({ email, password });

// If there are validation errors, return a 400 Bad Request response with the errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
// If validation passes, create a new user using the createUser function
  const user = await createUser(email, password);

  return res.status(201).json(user);
};