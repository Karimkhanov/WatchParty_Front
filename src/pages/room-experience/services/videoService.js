import { connectToSocketServer } from "../../../utils/simpleSocket"
import { API_URL, STREAMING_SERVICE_URL } from "../../../config"

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_URL || STREAMING_SERVICE_URL || "/stream-service"

export const fetchVideoUrl = async (roomId) => {
  const res = await fetch(`/stream-service/api/rooms/${roomId}`)
  if (!res.ok) throw new Error("Room not found")

  const data = await res.json()
  if (!data?.videoUrl) throw new Error("Video not found for this room")

  return data.videoUrl
}

export const connectToVideoSocket = async (handlers = {}) => {
  return connectToSocketServer(SOCKET_URL, handlers)
}

export const emitVideoEvent = (socket, roomId, type, currentTime) => {
  socket?.emit("videoEvent", { roomId, type, currentTime })
}
