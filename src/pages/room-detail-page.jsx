"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchRoom } from "../services/roomService"
import { connectToSocketServer } from "../utils/simpleSocket"
import "./room-detail-page.css"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000"

export default function RoomDetailPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasJoined, setHasJoined] = useState(false)
  const [status, setStatus] = useState("")
  const socketRef = useRef(null)
  const videoRef = useRef(null)
  const isApplyingRemoteState = useRef(false)

  useEffect(() => {
    loadRoom()

    return () => {
      socketRef.current?.close()
    }
  }, [roomId])

  useEffect(() => {
    if (!room || !hasJoined || !videoRef.current) return

    isApplyingRemoteState.current = true
    videoRef.current.currentTime = room.currentTime ?? 0

    if (room.isPlaying) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
    setTimeout(() => {
      isApplyingRemoteState.current = false
    }, 0)
  }, [room, hasJoined])

  const loadRoom = async () => {
    try {
      const data = await fetchRoom(roomId)
      setRoom({
        id: data.id,
        videoUrl: data.videoUrl,
        currentTime: data.currentTime ?? 0,
        isPlaying: data.isPlaying ?? false,
      })
    } catch (error) {
      console.error("Failed to fetch room:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (hasJoined) return

    try {
      const userId = localStorage.getItem("watchparty_user_id") || crypto.randomUUID()
      localStorage.setItem("watchparty_user_id", userId)

      const socket = await connectToSocketServer(SOCKET_URL, {
        onConnect: () => {
          setStatus("Connected to room")
        },
        onSyncState: ({ videoUrl, currentTime, isPlaying }) => {
          setRoom((prev) => ({
            id: roomId,
            videoUrl: videoUrl ?? prev?.videoUrl,
            currentTime: currentTime ?? prev?.currentTime ?? 0,
            isPlaying: typeof isPlaying === "boolean" ? isPlaying : prev?.isPlaying ?? false,
          }))
        },
        onVideoEvent: ({ type, currentTime }) => {
          setRoom((prev) => ({
            ...prev,
            currentTime: currentTime ?? prev?.currentTime ?? 0,
            isPlaying: type === "play" ? true : type === "pause" ? false : prev?.isPlaying ?? false,
          }))
        },
        onError: (message) => setStatus(message),
        onDisconnect: () => setStatus("Disconnected from room"),
      })

      socket.emit("joinRoom", { roomId, userId })
      socketRef.current = socket
      setHasJoined(true)
      setStatus("Connecting to room...")
    } catch (error) {
      console.error("Failed to join room:", error)
      alert("Unable to connect to the room right now.")
    }
  }

  const emitVideoEvent = (type) => {
    if (!socketRef.current || !videoRef.current || isApplyingRemoteState.current) return

    const currentTime = videoRef.current.currentTime
    socketRef.current.emit("videoEvent", { roomId, type, currentTime })
    setRoom((prev) => ({
      ...prev,
      currentTime,
      isPlaying: type === "play" ? true : type === "pause" ? false : prev?.isPlaying ?? false,
    }))
  }

  const getVideoEmbedUrl = (url) => {
    const videoId = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  if (loading) {
    return (
      <div className="room-detail-page">
        <div className="loading">Loading room...</div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="room-detail-page">
        <div className="error">Room not found</div>
        <button className="btn-join" onClick={() => navigate("/rooms")}>Back to rooms</button>
      </div>
    )
  }

  const canAccess = hasJoined

  if (!canAccess) {
    return (
      <div className="room-detail-page">
        <div className="join-prompt">
          <div className="join-card">
            <h1>Watch Party</h1>
            <p>Join the room to start watching together.</p>
            <button className="btn-join" onClick={handleJoinRoom}>
              Join Room
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="room-detail-page">
      <div className="room-content">
        <div className="video-section">
          <div className="video-header">
            <div>
              <h1>Room #{room.id}</h1>
              <p className="room-creator">{status || "Connected"}</p>
            </div>
          </div>

          <div className="video-player">
            {room.videoUrl?.includes("youtube") ? (
              <iframe
                src={getVideoEmbedUrl(room.videoUrl)}
                title="Watch Party Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoRef}
                controls
                src={room.videoUrl}
                onPlay={() => emitVideoEvent("play")}
                onPause={() => emitVideoEvent("pause")}
                onSeeked={() => emitVideoEvent("seek")}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div className="video-description">
            <h3>Now watching</h3>
            <p>{room.videoUrl}</p>
          </div>
        </div>
      </div>
    </div>
  )
}