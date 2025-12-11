"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useFavorites } from "../hooks/useFavorites"
import { apiService } from "../services/apiService"
import "./movie-details-page.css"

export default function MovieDetailsPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Получаем функцию и сам список избранного из хука или стора
  const { addToFavorites, removeFromFavorites } = useFavorites()
  const favorites = useSelector((state) => state.favorites.items) // Берем избранное из Redux
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    fetchMovieDetails()
  }, [movieId])

  const fetchMovieDetails = async () => {
    try {
      setLoading(true)
      const result = await apiService.getMovieDetails(movieId)
      if (result.success) {
        setMovie(result.data)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Failed to load movie details")
    } finally {
      setLoading(false)
    }
  }

  // Проверяем, есть ли фильм в избранном, используя Redux список
  // Сравниваем как числа или строки, чтобы точно совпало
  const favoriteItem = movie && favorites.find(f => Number(f.movieId) === Number(movie.id))
  const isFavorited = !!favoriteItem

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()
    if (!movie) return

    if (isFavorited) {
      // Если удаляем, используем ID документа Firebase (favoriteItem.id)
      await removeFromFavorites(favoriteItem.id, movie.id)
    } else {
      // Если добавляем, передаем объект фильма
      await addToFavorites(movie)
    }
  }

  if (loading) {
    return <div className="movie-details-main loading">Loading...</div>
  }

  if (error || !movie) {
    return (
      <div className="movie-details-main error">
        <p>{error || "Movie not found"}</p>
        <button onClick={() => navigate("/movies")}>Back to Movies</button>
      </div>
    )
  }

  return (
    <div className="movie-details-main">
      {/* Backdrop */}
      {movie.backdropPath && (
        <div className="backdrop">
          <img src={`https://image.tmdb.org/t/p/w1280${movie.backdropPath}`} alt={movie.title} />
        </div>
      )}

      <div className="details-container">
        {/* Poster and Basic Info */}
        <div className="details-header">
          <div className="poster-section">
            {movie.posterPath && (
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                alt={movie.title}
                className="poster-image"
              />
            )}
          </div>

          <div className="info-section">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="meta-info">
              <span className="release-date">{new Date(movie.releaseDate).getFullYear()}</span>
              <span className="rating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {movie.rating?.toFixed(1)} / 10
              </span>
              {movie.runtime && <span className="runtime">{movie.runtime} min</span>}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="genres">
                {movie.genres.map((genre) => (
                  <span key={genre} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <p className="overview">{movie.overview}</p>

            <div className="action-buttons">
              <button className={`favorite-btn ${isFavorited ? "active" : ""}`} onClick={handleFavoriteClick}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              </button>
              <button className="watch-btn">Watch Trailer</button>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="details-grid">
          {movie.budget > 0 && (
            <div className="detail-item">
              <h3>Budget</h3>
              <p>${(movie.budget / 1000000).toFixed(1)}M</p>
            </div>
          )}

          {movie.revenue > 0 && (
            <div className="detail-item">
              <h3>Revenue</h3>
              <p>${(movie.revenue / 1000000).toFixed(1)}M</p>
            </div>
          )}

          {movie.voteCount && (
            <div className="detail-item">
              <h3>Vote Count</h3>
              <p>{movie.voteCount.toLocaleString()}</p>
            </div>
          )}

          {movie.productionCountries && movie.productionCountries.length > 0 && (
            <div className="detail-item">
              <h3>Countries</h3>
              <p>{movie.productionCountries.join(", ")}</p>
            </div>
          )}
        </div>

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="cast-section">
            <h2>Cast</h2>
            <div className="cast-grid">
              {movie.cast.map((actor, index) => (
                <div key={index} className="cast-member">
                  {actor.profilePath && (
                    <img src={`https://image.tmdb.org/t/p/w342${actor.profilePath}`} alt={actor.name} />
                  )}
                  <h4>{actor.name}</h4>
                  <p>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {movie.recommendations && movie.recommendations.length > 0 && (
          <div className="recommendations-section">
            <h2>You Might Also Like</h2>
            <div className="recommendations-grid">
              {movie.recommendations.map((rec) => (
                <div key={rec.id} className="recommendation-card" onClick={() => navigate(`/movie/${rec.id}`)}>
                  {rec.posterPath && <img src={`https://image.tmdb.org/t/p/w342${rec.posterPath}`} alt={rec.title} />}
                  <h4>{rec.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="back-button" onClick={() => navigate("/movies")}>
        Back to Movies
      </button>
    </div>
  )
}