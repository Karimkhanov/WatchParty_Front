import { useParams } from "react-router-dom"
import ChatPanel from "./components/Chat"
import VideoPlayer from "./components/Video"
import "./RoomPage.css"
import { useRoomCheck } from "./hooks/useRoomCheck"

export default function RoomPage({ roomId: roomIdProp }) {
  const params = useParams()
  const roomId = roomIdProp || params.roomId
  const { roomExists } = useRoomCheck(roomId)

  if (roomExists === null) {
    return <div className="room-fallback">Loading room...</div>
  }

  if (!roomExists) {
    return <div className="room-fallback">Room not found</div>
  }

  return (
    <div className="room-page-wrapper">
      <div className="video-box">
        <div className="video-wrapper">
          <VideoPlayer roomId={roomId} />
        </div>
      </div>

      <div className="chat-box">
        <ChatPanel roomId={roomId} />
      </div>
    </div>
  )
}
