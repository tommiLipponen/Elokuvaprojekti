import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import MovieSearchPage from './pages/MovieSearchPage.jsx'
import MovieDetailPage from './pages/MovieDetailPage.jsx'
import NowInCinemasPage from './pages/NowInCinemasPage.jsx'
import GroupListPage from './pages/GroupListPage.jsx'
import GroupDetailPage from './pages/GroupDetailPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import FavoriteListPage from './pages/FavoriteListPage.jsx'
import SharedListPage from './pages/SharedListPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="movies" element={<MovieSearchPage />} />
        <Route path="movies/now-playing" element={<NowInCinemasPage />} />
        <Route path="movies/:id" element={<MovieDetailPage />} />
        <Route path="groups" element={<GroupListPage />} />
        <Route path="groups/:id" element={<GroupDetailPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="favorites" element={<FavoriteListPage />} />
        <Route path="shared" element={<SharedListPage />} />
      </Route>
    </Routes>
  )
}

export default App
