"use client"

import { useState } from "react"
import "./create-room-modal.css"

export default function CreateRoomModal({ onClose, onCreate, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    video_url: initialData?.video_url || "",
    video_type: initialData?.video_type || "youtube",
    thumbnail_url: initialData?.thumbnail_url || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.video_url.trim()) {
      alert("Title and video URL are required")
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
            <label htmlFor="title">Room Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter room title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter room description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="video_type">Video Type</label>
            <select id="video_type" name="video_type" value={formData.video_type} onChange={handleChange}>
              <option value="youtube">YouTube</option>
              <option value="direct">Direct URL</option>
            </select>
          </div>

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

          <div className="form-group">
            <label htmlFor="thumbnail_url">Thumbnail URL</label>
            <input
              type="url"
              id="thumbnail_url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
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
