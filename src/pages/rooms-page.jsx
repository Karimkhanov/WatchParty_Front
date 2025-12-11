"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import apiClient from "../api"
import CreateRoomModal from "../components/create-room-modal"
import "./rooms-page.css"

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const user = useSelector((state) => state.auth.user) 
  const navigate = useNavigate()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await apiClient.get("/rooms")
      setRooms(response.data.data)
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`)
  }

  const handleCreateRoom = async (roomData) => {
    try {
      const response = await apiClient.post("/rooms", roomData)
      setRooms([response.data.data, ...rooms])
      setShowCreateModal(false)
      navigate(`/room/${response.data.data.id}`)
    } catch (error) {
      console.error("Failed to create room:", error)
      alert(error.response?.data?.message || "Failed to create room")
    }
  }

  if (loading) {
    return (
      <div className="rooms-main">
        <div className="loading">Loading rooms...</div>
      </div>
    )
  }

  return (
    <div className="rooms-main">
      <div className="rooms-header">
        <div>
          <h1>Explore Public Rooms</h1>
          <p>Click on any room to join and start watching!</p>
        </div>
        {user && (
          <button className="btn-create-room" onClick={() => setShowCreateModal(true)}>
            + Create Room
          </button>
        )}
      </div>

      {rooms.length === 0 ? (
        <div className="no-rooms">
          <h2>No rooms available</h2>
          <p>Be the first to create a room!</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card" onClick={() => handleRoomClick(room.id)}>
              <div className="room-image">
                <img
                  src={room.thumbnail_url || "/placeholder.svg?height=280&width=200&query=movie poster"}
                  alt={room.title}
                />
              </div>
              <div className="room-info">
                <h3 className="room-title">{room.title}</h3>
                <div className="room-participants">
                  <div className="participant-avatars">
                    <div className="participant-avatar"></div>
                    <div className="participant-avatar"></div>
                    <div className="participant-avatar"></div>
                  </div>
                  <span className="participant-count">+{room.participant_count || 3}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateRoom} />}
    </div>
  )
}
