import { useEffect, useRef, useState } from "react"
import { connectToSocketServer } from "../../../utils/simpleSocket"
import ChatFooter from "./ChatFooter"
import MessageBox from "./MessageBox"
import "./Chat.css"

const CHAT_SOCKET_URL =
  import.meta.env.VITE_CHAT_SOCKET_URL ||
  import.meta.env.VITE_CHAT_API_URL ||
  "/chat-service"

export default function Chat({ roomId }) {
  const [messages, setMessages] = useState([])
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    let isMounted = true
    let connection

    const ensureUser = () => {
      const stored =
        localStorage.getItem("watchparty_chat_id") || crypto.randomUUID?.() || String(Date.now())
      localStorage.setItem("watchparty_chat_id", stored)
      setUserId(stored)
      return stored
    }

    const setup = async () => {
      ensureUser()
      try {
        connection = await connectToSocketServer(CHAT_SOCKET_URL, {
          onConnect: () => {
            connection?.emit("join_room", roomId)
            setConnected(true)
          },
          onMessage: (message) => {
            if (!isMounted) return
            setMessages((prev) => [...prev, message])
          },
        })

        if (!isMounted) return
        socketRef.current = connection
        setMessages([])
      } catch (error) {
        console.error("Failed to connect to chat", error)
        setConnected(false)
      }
    }

    setup()

    return () => {
      isMounted = false
      connection?.close?.()
      socketRef.current = null
    }
  }, [roomId])

  const sendMessage = (content) => {
    if (!content || !socketRef.current) return
    const payload = { senderId: userId, content, roomId }
    socketRef.current.emit("send_message", payload)
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <h3 className="chat-title">Chat</h3>
        <span className="chat-meta">{connected ? "Connected" : "Connecting..."}</span>
      </div>
      <MessageBox messages={messages} currentUserId={userId} />
      <ChatFooter sendMessage={sendMessage} />
    </div>
  )
}