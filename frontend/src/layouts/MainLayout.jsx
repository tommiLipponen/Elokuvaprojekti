import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

function MainLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
