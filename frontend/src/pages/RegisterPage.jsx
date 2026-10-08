import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5">
          <div className="register-card card">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">create account</h3>

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
                      minLength={8}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      👁
                    </button>
                  </div>
                </div>

                <p className="text-center mt-3 mb-0">
                  Password requirements:
                  <br />
                  - Minimum 8 characters
                  <br />
                  - One uppercase letter
                  <br />
                  - One number
                </p>

                <button type="submit" className="btn btn-primary w-100">
                  register!
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Already have an account?{' '}
                <Link to="/login" className="login-register-link">
                  Log in here.
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

export default RegisterPage;
