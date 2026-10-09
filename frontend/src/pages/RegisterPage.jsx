import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/authApi.js';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

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
              <h3 className="login-register-title">create account</h3>

              <form onSubmit={handleSubmit} className="register-form">
                <div className="mb-4">
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="email"
                    aria-label="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="input-group">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="password"
                      aria-label="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={8}
                    />

                    <button
                      type="button"
                      className="btn password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      👁
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="input-group">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="confirm password"
                      aria-label="Confirm password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      required
                      minLength={8}
                    />

                    <button
                      type="button"
                      className="btn password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                    >
                      👁
                    </button>
                  </div>
                </div>

                <p className="password-requirements">
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
                <p className="text-center mt-3 mb-0" role="status">
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