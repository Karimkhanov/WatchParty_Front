import axios from "axios"

const API_BASE_URL = "https://www.themoviedb.org/api"

// Using TMDB (The Movie Database) API - real API with 20,000+ movies
const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: "15c095447ebc29a2449ba955d7c178e2", // Public API key for demo
  },
})

export const apiService = {
  // Get list of popular movies
  getMovies: async (page = 1, searchQuery = "", sortBy = "popularity.desc") => {
    try {
      let endpoint = "/discover/movie"
      const params = {
        page,
        sort_by: sortBy,
        include_adult: false,
        language: "en-US",
      }

      if (searchQuery) {
        endpoint = "/search/movie"
        params.query = searchQuery
      }

      const response = await tmdbClient.get(endpoint, { params })

      return {
        success: true,
        data: response.data.results
          .filter((movie) => movie.title) // Filter out movies without titles
          .map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path || null, // Explicitly null if missing
            overview: movie.overview || "",
            releaseDate: movie.release_date || "N/A",
            rating: movie.vote_average || 0,
            voteCount: movie.vote_count || 0,
          })),
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
        currentPage: page,
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  // Get movie details with 7+ fields
  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}`, {
        params: {
          append_to_response: "credits,recommendations",
        },
      })

      const movie = response.data
      return {
        success: true,
        data: {
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          overview: movie.overview,
          releaseDate: movie.release_date,
          rating: movie.vote_average || 0, // Default to 0 if null
          voteCount: movie.vote_count || 0,
          runtime: movie.runtime || 0,
          budget: movie.budget || 0,
          revenue: movie.revenue || 0,
          genres: (movie.genres || []).map((g) => g.name),
          productionCountries: (movie.production_countries || []).map((c) => c.name),
          cast:
            movie.credits?.cast?.slice(0, 5).map((actor) => ({
              name: actor.name,
              character: actor.character,
              profilePath: actor.profile_path,
            })) || [],
          recommendations:
            movie.recommendations?.results?.slice(0, 5).map((m) => ({
              id: m.id,
              title: m.title,
              posterPath: m.poster_path,
            })) || [],
        },
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  // Search movies with query parameters
  searchMovies: async (query, page = 1) => {
    if (!query.trim()) {
      return { success: true, data: [], totalPages: 0 }
    }
    return apiService.getMovies(page, query)
  },

  // Get movies by genre filter
  getMoviesByGenre: async (genreId, page = 1) => {
    try {
      const response = await tmdbClient.get("/discover/movie", {
        params: {
          with_genres: genreId,
          page,
          sort_by: "popularity.desc",
        },
      })

      return {
        success: true,
        data: response.data.results
          .filter((movie) => movie.title)
          .map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path || null,
            overview: movie.overview || "",
            releaseDate: movie.release_date || "N/A",
            rating: movie.vote_average || 0,
            voteCount: movie.vote_count || 0,
          })),
        totalPages: response.data.total_pages,
        currentPage: page,
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  // Get movies by rating filter
  getMoviesByRating: async (minRating, maxRating, page = 1) => {
    try {
      const response = await tmdbClient.get("/discover/movie", {
        params: {
          "vote_average.gte": minRating,
          "vote_average.lte": maxRating,
          page,
          sort_by: "vote_average.desc",
        },
      })

      return {
        success: true,
        data: response.data.results
          .filter((movie) => movie.title)
          .map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path || null,
            overview: movie.overview || "",
            releaseDate: movie.release_date || "N/A",
            rating: movie.vote_average || 0,
            voteCount: movie.vote_count || 0,
          })),
        totalPages: response.data.total_pages,
        currentPage: page,
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },
}
