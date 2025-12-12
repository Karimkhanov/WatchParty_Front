"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import apiClient from "../api"
import "./chat.css"

export default function Chat({ roomId, guestName }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const fetchMessages = useCallback(async () => {
    try {
      const response = await apiClient.get(`/chat/${roomId}/messages`)
      setMessages(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const payload = {
        message: newMessage.trim(),
        ...(guestName && { guest_name: guestName }),
      }

      await apiClient.post(`/chat/${roomId}/messages`, payload)
      setNewMessage("")
      fetchMessages()
    } catch (error) {
      console.error("Failed to send message:", error)
      alert("Failed to send message")
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-loading">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
        <span className="chat-count">{messages.length} messages</span>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>No messages yet. Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <div className="message-header">
                <span className="message-author">
                  {msg.is_guest ? msg.guest_name : msg.username}
                  {msg.is_guest && <span className="guest-badge">Guest</span>}
                </span>
                <span className="message-time">{formatTime(msg.created_at)}</span>
              </div>
              <div className="message-content">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">
          Send
        </button>
      </form>
    </div>
  )
}