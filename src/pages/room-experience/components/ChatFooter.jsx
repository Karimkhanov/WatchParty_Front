import { useRef } from "react"
import "./ChatFooter.css"

export default function ChatFooter({ sendMessage }) {
  const textInput = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      createMessage()
    }
  }

  const createMessage = () => {
    const message = textInput.current?.value.trim()
    if (!message) return

    sendMessage(message)

    if (textInput.current) {
      textInput.current.value = ""
    }
  }

  return (
    <div className="chat-footer-wrapper">
      <input
        className="chat-input"
        type="text"
        placeholder="Type your message..."
        ref={textInput}
        onKeyDown={handleKeyDown}
      />

      <button className="chat-send-btn" onClick={createMessage}>
        Send
      </button>
    </div>
  )
}
