import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import favoritesReducer from "./slices/favoritesSlice"
import searchReducer from "./slices/searchSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    search: searchReducer,
  },
})

export default store
