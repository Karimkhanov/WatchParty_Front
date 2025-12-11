"use client"

import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setResults, setLoading, setError, setPage } from "../store/slices/searchSlice"
import { apiService } from "../services/apiService"

export function usePaginatedItems(searchQuery = "", filters = {}) {
  const dispatch = useDispatch()
  const { results, currentPage, totalPages, loading, error } = useSelector((state) => state.search)

  const fetchItems = useCallback(
    async (page = 1) => {
      dispatch(setLoading(true))
      dispatch(setError(null))

      try {
        let result

        if (searchQuery && searchQuery.trim()) {
          result = await apiService.searchMovies(searchQuery, page)
        } else if (filters?.genre) {
          result = await apiService.getMoviesByGenre(filters.genre, page)
        } else if (filters?.rating && filters.rating.min > 0) {
          result = await apiService.getMoviesByRating(filters.rating.min, filters.rating.max, page)
        } else {
          result = await apiService.getMovies(page)
        }

        if (result.success) {
          dispatch(
            setResults({
              data: result.data,
              totalPages: result.totalPages,
              currentPage: page,
            }),
          )
          dispatch(setPage(page))
        } else {
          dispatch(setError(result.message || "Failed to fetch movies"))
        }
      } catch (err) {
        dispatch(setError(err.message || "An error occurred"))
        console.error("[v0] usePaginatedItems error:", err)
      } finally {
        dispatch(setLoading(false))
      }
    },
    [searchQuery, filters, dispatch],
  )

  useEffect(() => {
    fetchItems(1)
  }, [searchQuery, filters])

  return {
    items: results,
    currentPage,
    totalPages,
    loading,
    error,
    setPage: (page) => fetchItems(page),
  }
}
