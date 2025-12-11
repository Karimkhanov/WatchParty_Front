"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useDebounce } from "../hooks/useDebounce"
import { useFavorites } from "../hooks/useFavorites"
import { setQuery, setFilters } from "../store/slices/searchSlice"
import { usePaginatedItems } from "../hooks/usePaginatedItems"
import "./movies-page.css"

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
]

export default function MoviesPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { query, filters, currentPage, totalPages } = useSelector((state) => state.search)
  const [localQuery, setLocalQuery] = useState(query)
  const [localFilters, setLocalFilters] = useState(filters)
  const { isFavorited } = useFavorites()

  const debouncedQuery = useDebounce(localQuery, 500)

  // Update Redux when debounced query changes
  useEffect(() => {
    if (debouncedQuery !== query) {
      dispatch(setQuery(debouncedQuery))
    }
  }, [debouncedQuery, query, dispatch])

  // Update Redux when filters change
  useEffect(() => {
    if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(localFilters))
    }
  }, [localFilters, filters, dispatch])

  const { items, loading, error, setPage } = usePaginatedItems(query, filters)

  const handleSearchChange = (e) => {
    setLocalQuery(e.target.value)
  }

  const handleGenreChange = (genreId) => {
    setLocalFilters({
      ...localFilters,
      genre: localFilters.genre === genreId ? null : genreId,
    })
  }

  const handleRatingChange = (e) => {
    const value = Number.parseInt(e.target.value)
    setLocalFilters({
      ...localFilters,
      rating: { min: value, max: 10 },
    })
  }

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="movies-main">
      <div className="movies-header">
        <h1>Discover Movies</h1>
        <p>Search through thousands of movies and add your favorites</p>
      </div>

      <div className="movies-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Search</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search movies..."
              value={localQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filter-section">
            <h3>Genres</h3>
            <div className="genre-list">
              {GENRES.map((genre) => (
                <label key={genre.id} className="genre-checkbox">
                  <input
                    type="checkbox"
                    checked={localFilters.genre === genre.id}
                    onChange={() => handleGenreChange(genre.id)}
                  />
                  <span>{genre.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Rating</h3>
            <div className="rating-filter">
              <input
                type="range"
                min="0"
                max="10"
                value={localFilters.rating?.min || 0}
                onChange={handleRatingChange}
              />
              <span>{localFilters.rating?.min || 0}+ stars</span>
            </div>
          </div>

          {/* Clear filters button */}
          {(localQuery || localFilters.genre || localFilters.rating?.min > 0) && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setLocalQuery("")
                setLocalFilters({ genre: null, rating: { min: 0, max: 10 } })
              }}
            >
              Clear All Filters
            </button>
          )}
        </aside>

        {/* Movies Grid */}
        <div className="movies-content">
          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading movies...</div>
          ) : items.length === 0 ? (
            <div className="no-results">
              <p>No movies found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="movies-grid">
                {items.map((movie) => {
                  const favorited = isFavorited(movie.id)
                  return (
                    <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie.id)}>
                      <div className="movie-poster">
                        {movie.posterPath ? (
                          <img src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`} alt={movie.title} />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                        {favorited && (
                          <div className="favorited-badge">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="movie-info">
                        <h3 className="movie-title">{movie.title}</h3>
                        <div className="movie-rating">
                          <span className="rating">{movie.rating?.toFixed(1)}</span>
                          <span className="rating-label">/ 10</span>
                        </div>
                        <p className="movie-year">{movie.releaseDate?.substring(0, 4)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
