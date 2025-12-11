"use client"

import { useEffect } from "react" 
import { Routes, Route, Navigate } from "react-router-dom"
import { useDispatch } from "react-redux" 
import { useAuth } from "./contexts/AuthContext"

import { setFavorites } from "./store/slices/favoritesSlice"
import { favoritesService } from "./services/favoritesService"

import HomePage from "./pages/home-page"
import MoviesPage from "./pages/movies-page"
import MovieDetailsPage from "./pages/movie-details-page"
import FavoritesPage from "./pages/favorites-page"
import ProfilePage from "./pages/profile-page"
import LoginPage from "./pages/login-page"
import SignupPage from "./pages/signup-page"
import RoomsPage from "./pages/rooms-page"
import AboutPage from "./pages/about-page"
import RoomDetailPage from "./pages/room-detail-page"
import Header from "./components/header"
import { OfflineBanner } from "./components/offline-banner"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  const { isAuthenticated, loading, user } = useAuth() // Достаем user
  const dispatch = useDispatch()

  // Загрузка избранного при старте или логине
  useEffect(() => {
    const loadUserData = async () => {
      if (user && user.uid) {
        const result = await favoritesService.getUserFavorites(user.uid)
        if (result.success) {
          dispatch(setFavorites(result.data))
        }
      }
    };

    loadUserData();
  }, [user, dispatch]);

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="loading-container">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <OfflineBanner />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/room/:roomId" element={<RoomDetailPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App