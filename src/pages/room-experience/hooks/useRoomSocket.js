import { useEffect, useState } from "react"
import { fetchVideoUrl, connectToVideoSocket } from "../services/videoService"

export function useRoomSocket(roomId, videoRef, setVideoUrl, setIsPlaying) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    let connection
    let isMounted = true

    const userId =
      localStorage.getItem("watchparty_user_id") || crypto.randomUUID?.() || String(Date.now())
    localStorage.setItem("watchparty_user_id", userId)

    const setup = async () => {
      try {
        const url = await fetchVideoUrl(roomId)
        if (!isMounted) return
        setVideoUrl(url)

        connection = await connectToVideoSocket({
          onConnect: () => {
            connection?.emit("joinRoom", { roomId, userId })
          },
          onSyncState: ({ videoUrl, currentTime, isPlaying }) => {
            const video = videoRef.current
            if (!video) return

            if (videoUrl) setVideoUrl(videoUrl)
            video.currentTime = currentTime || 0

            if (isPlaying) {
              video.play().catch(() => {})
              setIsPlaying(true)
            } else {
              video.pause()
              setIsPlaying(false)
            }
          },
          onVideoEvent: ({ type, currentTime }) => {
            const video = videoRef.current
            if (!video) return

            switch (type) {
              case "play":
                video.currentTime = currentTime
                video.play().catch(() => {})
                setIsPlaying(true)
                break
              case "pause":
                video.pause()
                setIsPlaying(false)
                break
              case "seek":
                video.currentTime = currentTime
                break
              default:
                break
            }
          },
          onError: () => {},
        })

        if (!isMounted) return
        setSocket(connection)
      } catch (error) {
        console.error(error)
        alert("⚠️ Unable to connect to the room right now.")
      }
    }

    setup()

    return () => {
      isMounted = false
      connection?.close?.()
    }
  }, [roomId, videoRef, setVideoUrl, setIsPlaying])

  return socket
}
