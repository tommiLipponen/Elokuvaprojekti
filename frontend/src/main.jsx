import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/bootstrap-theme.css'
import './index.css';
import './styles/navbar.css';
import './styles/movie-card.css';
import './styles/home.css';
import './styles/movie.css';
import './styles/search.css';
import './styles/profile.css';
import './styles/groups.css';
import './styles/favorites.css';
import './styles/login-register.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
