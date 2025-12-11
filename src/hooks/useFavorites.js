"use client"

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addFavorite, removeFavorite } from "../store/slices/favoritesSlice"
import { favoritesService } from "../services/favoritesService"

export function useFavorites() {
  const dispatch = useDispatch()
  const favorites = useSelector((state) => state.favorites.items)
  const user = useSelector((state) => state.auth.user)

  const addToFavorites = useCallback(
    async (movie) => {
      if (!user) {
        // Гости: localStorage
        const localFavs = favoritesService.getLocalFavorites()
        const newFav = {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.posterPath,
          overview: movie.overview,
          rating: movie.rating,
          id: `local-${movie.id}`,
        }
        const updated = [...localFavs, newFav]
        favoritesService.saveLocalFavorites(updated)
        dispatch(addFavorite(newFav))
      } else {
        // Авторизованные: Firestore
        // 1. Отправляем в базу
        const result = await favoritesService.addFavorite(user.uid, movie.id, movie)
        
        if (result.success) {
          // 2. ВАЖНО: В Redux добавляем с ТЕМ ЖЕ ID, который вернул Firebase (result.id)
          // А не Date.now(), иначе потом не удалится!
          dispatch(
            addFavorite({
              id: result.id, 
              movieId: movie.id,
              ...movie,
            }),
          )
        } else {
            console.error("Failed to add favorite:", result.message)
        }
      }
    },
    [user, dispatch],
  )

  const removeFromFavorites = useCallback(
    async (favoriteId, movieId) => {
      if (!user) {
        // Гости
        const localFavs = favoritesService.getLocalFavorites()
        const updated = localFavs.filter((f) => f.movieId !== movieId)
        favoritesService.saveLocalFavorites(updated)
        dispatch(removeFavorite(favoriteId))
      } else {
        // Авторизованные
        // Удаляем по ID документа
        const result = await favoritesService.removeFavorite(favoriteId)
        if (result.success) {
          dispatch(removeFavorite(favoriteId))
        } else {
            console.error("Failed to remove favorite:", result.message)
        }
      }
    },
    [user, dispatch],
  )

  const isFavorited = useCallback(
    (movieId) => {
      // Приводим к строке или числу для надежного сравнения
      return favorites.some((f) => Number(f.movieId) === Number(movieId))
    },
    [favorites],
  )

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
  }
}