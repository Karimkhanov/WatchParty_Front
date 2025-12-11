export function connectToSocketServer(url, handlers = {}) {
  return new Promise((resolve, reject) => {
    const wsUrl = `${url.replace(/^http/, "ws")}/socket.io/?EIO=4&transport=websocket`
    const socket = new WebSocket(wsUrl)
    let pingIntervalId
    let isReady = false

    const cleanup = () => {
      if (pingIntervalId) {
        clearInterval(pingIntervalId)
      }
    }

    const emit = (event, payload = {}) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(`42${JSON.stringify([event, payload])}`)
      }
    }

    const close = () => {
      cleanup()
      socket.close()
    }

    const handleMessage = (message) => {
      if (message === "2") {
        socket.send("3")
        return
      }

      if (message.startsWith("0")) {
        try {
          const payload = JSON.parse(message.slice(1))
          if (payload.pingInterval) {
            pingIntervalId = setInterval(() => {
              if (socket.readyState === WebSocket.OPEN) {
                socket.send("2")
              }
            }, payload.pingInterval)
          }
        } catch (error) {
          console.warn("Failed to parse socket handshake", error)
        }
        socket.send("40")
        return
      }

      if (message === "40") {
        isReady = true
        resolve({ emit, close })
        handlers.onConnect?.()
        return
      }

      if (!message.startsWith("42")) return

      try {
        const [event, payload] = JSON.parse(message.slice(2))
        if (event === "syncState") handlers.onSyncState?.(payload)
        if (event === "videoEvent") handlers.onVideoEvent?.(payload)
        if (event === "error") handlers.onError?.(payload)
      } catch (error) {
        console.warn("Failed to parse socket message", error)
      }
    }

    socket.onmessage = (event) => handleMessage(event.data)

    socket.onerror = (err) => {
      cleanup()
      if (!isReady) {
        reject(err)
      }
      handlers.onError?.("Unable to reach the room server.")
    }

    socket.onclose = () => {
      cleanup()
      handlers.onDisconnect?.()
    }
  })
}