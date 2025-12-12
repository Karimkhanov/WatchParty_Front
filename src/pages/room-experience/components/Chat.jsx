import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatFooter from "./ChatFooter";
import MessageBox from "./MessageBox";
import "./Chat.css";

const CHAT_API_URL = "/chat-service";

export default function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  const [userId] = useState(() => 
    localStorage.getItem("watchparty_chat_id") || crypto.randomUUID()
  );

  useEffect(() => {
    localStorage.setItem("watchparty_chat_id", userId);

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${CHAT_API_URL}/api/chat/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchHistory();

    // 2. Подключение к сокетам
    const socket = io(CHAT_API_URL, {
      transports: ["websocket"],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("💬 Connected to Chat Server");
      setConnected(true);
      // Бэкенд ждет просто строку roomId
      socket.emit("join_room", roomId);
    });

    socket.on("connect_error", (err) => {
      console.error("Chat connection error:", err);
      setConnected(false);
    });

    // 3. Получение новых сообщений
    // Сервер делает io.to(roomId).emit("receive_message", newMessage),
    // поэтому сообщение придет и отправителю тоже.
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [roomId, userId]);

  const sendMessage = (content) => {
    if (!content.trim() || !socketRef.current) return;

    const payload = { 
      senderId: userId, 
      content, 
      roomId 
    };
    
    socketRef.current.emit("send_message", payload);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <h3 className="chat-title">Chat</h3>
        <span className={`chat-status ${connected ? "online" : "offline"}`}>
          {connected ? "Online" : "Connecting..."}
        </span>
      </div>
      
      <MessageBox messages={messages} currentUserId={userId} />
      
      <ChatFooter sendMessage={sendMessage} />
    </div>
  );
}