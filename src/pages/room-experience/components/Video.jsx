import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./Video.css";
import { useVideoPlayer } from "../hooks/useVideoPlayer";

const SOCKET_URL = "/stream-service";

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
  } = useVideoPlayer();

  const [videoUrl, setVideoUrl] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);
  const socketRef = useRef(null);

  const userId = useRef(
    localStorage.getItem("watchparty_user_id") || 
    Math.random().toString(36).substr(2, 9)
  ).current;

  useEffect(() => {
    localStorage.setItem("watchparty_user_id", userId);

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });
    
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connected to Stream Server:", socket.id);
      socket.emit("joinRoom", { roomId, userId });
    });

    socket.on("syncState", (state) => {
      console.log("🔄 Sync State:", state);
      setVideoUrl(state.videoUrl);
      
      const video = videoRef.current;
      if (video) {
        const syncTime = () => {
          video.currentTime = state.currentTime;
          if (state.isPlaying) {
            video.play().catch((e) => console.warn("Autoplay blocked:", e));
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        };

        if (video.readyState >= 1) {
          syncTime();
        } else {
          video.onloadedmetadata = syncTime;
        }
      }
    });

    socket.on("videoEvent", ({ type, currentTime }) => {
      const video = videoRef.current;
      if (!video) return;

      const timeDiff = Math.abs(video.currentTime - currentTime);

      switch (type) {
        case "play":
          video.currentTime = currentTime; 
          video.play().catch(console.error);
          setIsPlaying(true);
          break;
        case "pause":
          video.pause();
          setIsPlaying(false);
          if (timeDiff > 0.5) video.currentTime = currentTime;
          break;
        case "seek":
          video.currentTime = currentTime;
          break;
        default:
          break;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userId, setIsPlaying, videoRef]);

  const emitEvent = (type, time) => {
    if (socketRef.current) {
      socketRef.current.emit("videoEvent", {
        roomId,
        type,
        currentTime: time,
      });
    }
  };


  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      emitEvent("play", video.currentTime);
    } else {
      video.pause();
      setIsPlaying(false);
      emitEvent("pause", video.currentTime);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    
    const seekValue = parseFloat(e.target.value);
    const seekTime = (seekValue / 100) * (video.duration || 0);
    
    video.currentTime = seekTime;
    emitEvent("seek", seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMutedState = !isMuted;
      videoRef.current.muted = nextMutedState;
      setIsMuted(nextMutedState);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.parentElement?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  return (
    <div
      className="video-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {!videoUrl && <div className="video-placeholder">Waiting for host to select video...</div>}
      
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
            step="0.1"
            value={progress || 0}
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
  );
};

export default Video;