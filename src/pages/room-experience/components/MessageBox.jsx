import "./MessageBox.css"

export default function MessageBox({ messages, currentUserId }) {
  let previousSender = null

  return (
    <div className="message-box-wrapper">
      {messages.length === 0 && (
        <div className="chat-empty-state">No messages yet. Start the conversation!</div>
      )}
      {messages.map((message, index) => {
        const isContinuation = previousSender === message.senderId
        previousSender = message.senderId
        const isCurrent = message.senderId === currentUserId

        return (
          <div
            key={message.id || `${message.senderId}-${index}`}
            className={`message-group ${isContinuation ? "continuation" : ""}`}
          >
            {!isContinuation && (
              <span className="msg-sender-id">{message.senderId || "Guest"}</span>
            )}
            <div className={`message ${isCurrent ? "current" : "other"}`}>
              {message.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
