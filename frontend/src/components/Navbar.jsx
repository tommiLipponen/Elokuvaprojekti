import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';

function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const { accessToken, user, logout } = useAuth();
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
    <BootstrapNavbar
      expand="xl"
      className="navbar"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="navbar-title">
          elokuvaprojekti
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="mainNavbar" aria-label="Toggle navigation" />

        <BootstrapNavbar.Collapse id="mainNavbar">
          {accessToken && (
            <BootstrapNavbar.Text className="me-auto navbar-greeting">
              hi, {user?.username}
            </BootstrapNavbar.Text>
          )}

          <Nav className="ms-auto" onClick={() => setExpanded(false)}>
            <Nav.Link as={Link} to="/movies">
              search
            </Nav.Link>

            <Nav.Link as={Link} to="/movies/now-playing">
              in cinemas
            </Nav.Link>

            <Nav.Link as={Link} to="/shared">
              shared lists
            </Nav.Link>

            <Nav.Link as={Link} to="/groups">
              groups
            </Nav.Link>

            {!accessToken ? (
              <Nav.Link as={Link} to="/login">
                login
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/favorites">
                  favorites
                </Nav.Link>

                <Nav.Link as={Link} to="/profile">
                  profile
                </Nav.Link>
              
                <Nav.Link as={Link} to="/" onClick={handleLogout}>
                  logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;