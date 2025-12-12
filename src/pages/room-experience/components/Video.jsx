import { useState, useRef } from "react"
import "./Video.css"
import { useVideoPlayer } from "../hooks/useVideoPlayer"
import { useRoomSocket } from "../hooks/useRoomSocket"
import { emitVideoEvent } from "../services/videoService"

const Video = ({ roomId }) => {
  const {
    videoRef,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    progress,
  } = useVideoPlayer()

  const [videoUrl, setVideoUrl] = useState(null)
  const socketRef = useRef(null)

  const socket = useRoomSocket(roomId, videoRef, setVideoUrl, setIsPlaying)
  if (socket && socketRef.current !== socket) {
    socketRef.current = socket
  }

  const handlePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
      emitVideoEvent(socketRef.current, roomId, "play", video.currentTime)
    } else {
      video.pause()
      setIsPlaying(false)
      emitVideoEvent(socketRef.current, roomId, "pause", video.currentTime)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video) return
    const seekTime = (parseFloat(e.target.value) / 100) * (video.duration || 0)
    video.currentTime = seekTime
    emitVideoEvent(socketRef.current, roomId, "seek", seekTime)
  }

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.parentElement?.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeout.current)
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }
  }

  const [showControls, setShowControls] = useState(true)
  const controlsTimeout = useRef(null)

  return (
    <div
      className="video-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="video-player"
        src={videoUrl || undefined}
        onClick={handlePlayPause}
      />
      <div className={`video-controls ${showControls ? "visible" : ""}`}>
        <div className="progress-bar-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            className="progress-bar"
            onChange={handleSeek}
          />
        </div>
        <div className="controls-row">
          <div className="controls-left">
            <button onClick={handlePlayPause} className="control-button">
              {isPlaying ? "Pause" : "Play"}
            </button>
            <div className="volume-control">
              <button onClick={toggleMute} className="control-button">
                {isMuted || volume === 0 ? "Unmute" : "Mute"}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                className="volume-slider"
                onChange={handleVolumeChange}
              />
            </div>
          </div>
          <div className="controls-right">
            <button onClick={toggleFullScreen} className="control-button">
              Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Video