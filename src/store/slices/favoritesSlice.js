import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  loading: false,
  error: null,
  merged: false,
}

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload
      state.error = null
    },
    addFavorite: (state, action) => {
      state.items.push(action.payload)
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setMerged: (state, action) => {
      state.merged = action.payload
    },
    clearFavorites: (state) => {
      state.items = []
      state.merged = false
    },
  },
})

export const { setFavorites, addFavorite, removeFavorite, setLoading, setError, setMerged, clearFavorites } =
  favoritesSlice.actions
export default favoritesSlice.reducer
