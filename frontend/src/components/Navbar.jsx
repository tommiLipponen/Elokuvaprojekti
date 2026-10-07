import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Movie App
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

            <Link className="nav-link" to="/profile">
              profile
            </Link>

            <Link className="nav-link" to="/shared">
              shared lists
            </Link>

            <Link className="nav-link" to="/login">
              Login
            </Link>

            <Link className="nav-link" to="/register">
              Register
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

/*import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/movies">Movie Search</Link>
      <Link to="/movies/now-playing">Now in Cinemas</Link>
      <Link to="/groups">Groups</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/favorites">Favorites</Link>
      <Link to="/shared">Shared List</Link>
    </nav>
  );
}

export default Navbar;*/
