import apiClient from "../api"

export async function fetchRooms() {
  const response = await apiClient.get("/rooms")
  return response.data.rooms || []
}

export async function createRoom(videoUrl) {
  const response = await apiClient.post("/rooms", { videoUrl })
  return response.data
}

export async function fetchRoom(roomId) {
  const response = await apiClient.get(`/rooms/${roomId}`)
  return response.data
}