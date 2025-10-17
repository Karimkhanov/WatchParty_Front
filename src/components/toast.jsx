"use client"

import { useState, useEffect } from "react"
import "./toast.css"

let toastQueue = []
let toastListener = null

export const showToast = (message, type = "info") => {
  const toast = {
    id: Date.now(),
    message,
    type,
  }

  toastQueue.push(toast)

  if (toastListener) {
    toastListener(toast)
  }

  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== toast.id)
    if (toastListener) {
      toastListener(null)
    }
  }, 3000)
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastListener = (toast) => {
      if (toast) {
        setToasts((prev) => [...prev, toast])
      } else {
        setToasts(toastQueue)
      }
    }

    return () => {
      toastListener = null
    }
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    toastQueue = toastQueue.filter((t) => t.id !== id)
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} onClick={() => removeToast(toast.id)}>
          <div className="toast-content">
            {toast.type === "success" && <span className="toast-icon">✓</span>}
            {toast.type === "error" && <span className="toast-icon">✕</span>}
            {toast.type === "info" && <span className="toast-icon">ℹ</span>}
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
