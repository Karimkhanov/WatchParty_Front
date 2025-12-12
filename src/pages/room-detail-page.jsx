"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchRoom } from "../services/roomService"
import RoomPage from "./room-experience/RoomPage"
import "./room-detail-page.css"

export default function RoomDetailPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasJoined, setHasJoined] = useState(false)

  const loadRoom = async () => {
    try {
      const data = await fetchRoom(roomId)
      setRoom({
        id: data.id,
        videoUrl: data.videoUrl,
      })
    } catch (error) {
      console.error("Failed to fetch room:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoom()
  }, [roomId])

  const handleJoinRoom = async () => {
    if (hasJoined) return
    const userId = localStorage.getItem("watchparty_user_id") || crypto.randomUUID()
    localStorage.setItem("watchparty_user_id", userId)
    setHasJoined(true)
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
    <div className="room-detail-page room-detail-fullscreen">
      <RoomPage roomId={room.id} />
    </div>
  )
}