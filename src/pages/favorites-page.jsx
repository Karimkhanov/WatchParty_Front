"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useFavorites } from "../hooks/useFavorites"
import { favoritesService } from "../services/favoritesService"
import "./favorites-page.css"

export default function FavoritesPage() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const { favorites, removeFromFavorites } = useFavorites()
  const [showMergeMessage, setShowMergeMessage] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load favorites for logged-in users
    if (user) {
      loadUserFavorites()
    } else {
      // Load local favorites for guests
      loadLocalFavorites()
    }
  }, [user])

  const loadUserFavorites = async () => {
    setLoading(true)
    const result = await favoritesService.getUserFavorites(user.uid)
    if (result.success) {
      // Update Redux with user favorites
    }
    setLoading(false)
  }

  const loadLocalFavorites = () => {
    // Local favorites are already in Redux from initial load
  }

  const handleRemoveFavorite = async (favoriteId, movieId) => {
    await removeFromFavorites(favoriteId, movieId)
  }

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`)
  }

  if (!user) {
    return (
      <div className="favorites-main">
        <div className="favorites-header">
          <h1>My Favorites</h1>
        </div>
        <div className="auth-required">
          <p>Sign in to save your favorite movies and access them across devices.</p>
          <button onClick={() => navigate("/login")} className="signin-btn">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-main">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <p>{favorites.length} movies saved</p>
      </div>

      {showMergeMessage && (
        <div className="merge-message">
          <p>Your local favorites were merged with your account.</p>
          <button onClick={() => setShowMergeMessage(false)}>Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="no-favorites">
          <p>You haven't added any favorites yet.</p>
          <button onClick={() => navigate("/movies")} className="browse-btn">
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-card">
              <div className="favorite-poster">
                {favorite.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${favorite.posterPath}`}
                    alt={favorite.title}
                    onClick={() => handleMovieClick(favorite.movieId)}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="favorite-info">
                <h3 onClick={() => handleMovieClick(favorite.movieId)} className="favorite-title">
                  {favorite.title}
                </h3>
                {favorite.rating && <div className="favorite-rating">{favorite.rating?.toFixed(1)} / 10</div>}
                <button onClick={() => handleRemoveFavorite(favorite.id, favorite.movieId)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
