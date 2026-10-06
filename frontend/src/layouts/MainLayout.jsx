import { Outlet } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from '../components/Navbar.jsx';

function MainLayout() {
  return (
    <div>
      <Navbar />
      <Container as="main">
        <Outlet />
      </Container>
    </div>
  );
}

export default MainLayout;
