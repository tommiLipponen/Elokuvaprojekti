
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

function Navbar() {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      await logout();
    } finally {
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-title" to="/">
          elokuvaprojekti
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/movies">
              search
            </Link>

            <Link className="nav-link" to="/groups">
              groups
            </Link>

            <Link className="nav-link" to="/favorites">
              favorites
            </Link>

            <Link className="nav-link" to="/movies/now-playing">
              in cinemas
            </Link>

            <Link className="nav-link" to="/shared">
              shared lists
            </Link>

            {!accessToken ? (
              <Link className="nav-link" to="/login">
                login
              </Link>
            ) : (
              <>
                <Link className="nav-link" to="/profile">
                  profile
                </Link>

                <Link
                  className="nav-link"
                  to="/"
                  onClick={handleLogout}
                >
                  logout
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;