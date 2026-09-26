import { useState } from 'react';
import { register } from '../services/authApi.js';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

const handleSubmit = async (event) => {
  event.preventDefault();
  setMessage('');

  try {
    const response = await register({ email, password });

    if (response.errors) {
      setMessage('Registration failed.');
      return;
    }

    setMessage('Registration successful!');
  } catch {
    setMessage('Registration failed.');
  }
};



  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
          <span id="togglePassword" onClick={() => setShowPassword(!showPassword)}>
            👁
          </span>
        </div>

        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterPage;
