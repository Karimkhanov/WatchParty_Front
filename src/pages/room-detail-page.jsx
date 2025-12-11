"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import apiClient from "../api"
import Chat from "../components/chat"
import CreateRoomModal from "../components/create-room-modal"
import "./room-detail-page.css"

export default function RoomDetailPage() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guestName, setGuestName] = useState("")
  const [hasJoined, setHasJoined] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [participants, setParticipants] = useState([])

  useEffect(() => {
    fetchRoom()
  }, [roomId])

  const fetchRoom = async () => {
    try {
      const response = await apiClient.get(`/rooms/${roomId}`)
      setRoom(response.data.data)
      setParticipants(response.data.data.participants || [])
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch room:", error)
      setLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!user && !guestName.trim()) {
      alert("Please enter your name to join")
      return
    }

    try {
      await apiClient.post(`/rooms/${roomId}/join`, {
        guest_name: !user ? guestName : undefined,
      })
      setHasJoined(true)
      fetchRoom()
    } catch (error) {
      console.error("Failed to join room:", error)
      alert("Failed to join room")
    }
  }

  const handleUpdateRoom = async (roomData) => {
    try {
      await apiClient.put(`/rooms/${roomId}`, roomData)
      setShowEditModal(false)
      fetchRoom()
    } catch (error) {
      console.error("Failed to update room:", error)
      alert(error.response?.data?.message || "Failed to update room")
    }
  }

  const handleDeleteRoom = async () => {
    if (!window.confirm("Are you sure you want to delete this room?")) return

    try {
      await apiClient.delete(`/rooms/${roomId}`)
      navigate("/rooms")
    } catch (error) {
      console.error("Failed to delete room:", error)
      alert("Failed to delete room")
    }
  }

  const getVideoEmbedUrl = (url, type) => {
    if (type === "youtube") {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    return url
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
      </div>
    )
  }

  const isCreator = user && room.creator_id === user.id
  const canAccess = user || hasJoined

  if (!canAccess) {
    return (
      <div className="room-detail-page">
        <div className="join-prompt">
          <div className="join-card">
            <h1>{room.title}</h1>
            <p>{room.description}</p>

            {!user && (
              <div className="guest-form">
                <label htmlFor="guestName">Enter your name to join:</label>
                <input
                  type="text"
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                  onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
                />
              </div>
            )}

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
              <h1>{room.title}</h1>
              <p className="room-creator">Created by {room.creator_username}</p>
            </div>
            {isCreator && (
              <div className="room-actions">
                <button className="btn-edit" onClick={() => setShowEditModal(true)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={handleDeleteRoom}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="video-player">
            {room.video_type === "youtube" ? (
              <iframe
                src={getVideoEmbedUrl(room.video_url, room.video_type)}
                title={room.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls src={room.video_url}>
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {room.description && (
            <div className="video-description">
              <h3>Description</h3>
              <p>{room.description}</p>
            </div>
          )}

          <div className="participants-section">
            <h3>Participants ({participants.length})</h3>
            <div className="participants-list">
              {participants.map((participant, index) => (
                <div key={index} className="participant">
                  <div className="participant-avatar">{participant.is_guest ? "👤" : "👨‍💻"}</div>
                  <span className="participant-name">
                    {participant.is_guest ? participant.guest_name : participant.username}
                    {participant.is_guest && <span className="guest-badge">Guest</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chat-section">
          <Chat roomId={roomId} guestName={guestName} />
        </div>
      </div>

      {showEditModal && (
        <CreateRoomModal onClose={() => setShowEditModal(false)} onCreate={handleUpdateRoom} initialData={room} />
      )}
    </div>
  )
}
