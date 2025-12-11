import { collection, query, where, getDocs, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../config/firebase"

export const favoritesService = {
  // Get user's favorites from Firestore
  getUserFavorites: async (userId) => {
    try {
      const q = query(collection(db, "favorites"), where("userId", "==", userId))
      const snapshot = await getDocs(q)
      const favorites = []
      snapshot.forEach((doc) => {
        favorites.push({
          id: doc.id, // Это ID документа Firebase
          ...doc.data(),
        })
      })
      return { success: true, data: favorites }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  // Add movie to favorites in Firestore
  addFavorite: async (userId, movieId, movieData) => {
    try {
      const docRef = await addDoc(collection(db, "favorites"), {
        userId,
        movieId,
        title: movieData.title,
        posterPath: movieData.posterPath,
        overview: movieData.overview,
        rating: movieData.rating,
        addedAt: serverTimestamp(),
      })
      // Возвращаем ID созданного документа
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  // Remove movie from favorites
  removeFavorite: async (favoriteId) => {
    try {
      await deleteDoc(doc(db, "favorites", favoriteId))
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  // Check if movie is favorited
  isFavorited: async (userId, movieId) => {
    try {
      const q = query(collection(db, "favorites"), where("userId", "==", userId), where("movieId", "==", movieId))
      const snapshot = await getDocs(q)
      return { success: true, isFavorited: !snapshot.empty, docId: snapshot.docs[0]?.id }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  // Get local favorites from localStorage
  getLocalFavorites: () => {
    try {
      const stored = localStorage.getItem("localFavorites")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  // Save favorites to localStorage
  saveLocalFavorites: (favorites) => {
    localStorage.setItem("localFavorites", JSON.stringify(favorites))
  },

  // Merge local favorites with Firestore favorites on login
  mergeFavorites: async (userId, localFavorites) => {
    try {
      for (const favorite of localFavorites) {
        const existsResult = await favoritesService.isFavorited(userId, favorite.movieId)
        if (!existsResult.isFavorited) {
          await favoritesService.addFavorite(userId, favorite.movieId, favorite)
        }
      }
      localStorage.removeItem("localFavorites")
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },
}