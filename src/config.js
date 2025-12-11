const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  console.warn("VITE_API_URL is not set. API requests will fail without a configured backend URL.")
}

export const API_URL = apiUrl || ""