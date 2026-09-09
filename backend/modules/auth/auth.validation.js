


// check that email is in a valid format. Needs to contain an "@" symbol and a domain name (e.g., pekka.pouta@example.com)
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check that password is at least 8 characters long, contains at least one uppercase letter, and at least one number
export const validatePassword = (password) => {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
};

export const validateAuth = ({ email, password }) => {
  const errors = {};

  if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }

  if (!validatePassword(password)) {
    errors.password =
      'Password must be at least 8 characters long, contain one uppercase letter and one number';
  }

  return errors;
};
