import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/movies">Movie Search</Link>
      <Link to="/groups">Groups</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/favorites">Favorites</Link>
      <Link to="/shared">Shared List</Link>
    </nav>
  );
}

export default Navbar;
