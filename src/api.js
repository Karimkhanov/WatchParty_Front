import axios from "axios"
import { API_URL, STREAMING_SERVICE_URL } from "./config"

const apiBaseUrl = `/stream-service/api`

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default apiClient