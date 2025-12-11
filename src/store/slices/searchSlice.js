import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  query: "",
  results: [],
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    genre: null,
    rating: { min: 0, max: 10 },
  },
}

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload
      state.currentPage = 1
    },
    setResults: (state, action) => {
      state.results = action.payload.data
      state.totalPages = action.payload.totalPages
      state.currentPage = action.payload.currentPage
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.currentPage = 1
    },
    clearSearch: (state) => {
      state.query = ""
      state.results = []
      state.currentPage = 1
      state.filters = initialState.filters
    },
  },
})

export const { setQuery, setResults, setPage, setLoading, setError, setFilters, clearSearch } = searchSlice.actions
export default searchSlice.reducer
