import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await login({ email, password });
      navigate('/');
      setMessage('Login successful!');
    } catch (error) {
      setMessage(error.message || 'Login failed.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5">
          <div className="login-card card">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">login</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    email
                  </label>

                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    password
                  </label>

                  <div className="input-group">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      👁
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  log in!
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="login-register-link">
                  Register here.
                </Link>
              </p>

              {message && (
                <p className="mt-3 mb-0">
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;