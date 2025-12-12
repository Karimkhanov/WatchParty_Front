import { useRef, useState, useEffect } from "react"

export function useVideoPlayer() {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleProgress = () => {
    const video = videoRef.current
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.addEventListener("timeupdate", handleProgress)
    video.addEventListener("play", () => setIsPlaying(true))
    video.addEventListener("pause", () => setIsPlaying(false))

    return () => {
      video.removeEventListener("timeupdate", handleProgress)
    }
  }, [])

  return {
    videoRef,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    progress,
  }
}
