"use client"

import { useState } from "react"
import "./create-room-modal.css"

export default function CreateRoomModal({ onClose, onCreate, initialData = null }) {
  const [formData, setFormData] = useState({
    video_url: initialData?.video_url || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.video_url.trim()) {
      alert("Video URL is required")
      return
    }
    onCreate(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? "Edit Room" : "Create New Room"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="video_url">Video URL *</label>
            <input
              type="url"
              id="video_url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {initialData ? "Update Room" : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}