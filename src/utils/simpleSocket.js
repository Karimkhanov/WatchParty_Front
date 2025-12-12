const ensureLeadingSlash = (path) => (path.startsWith("/") ? path : `/${path}`)

const buildWebSocketUrl = (url = "") => {
  const trimmed = url.replace(/\/$/, "")

  if (!trimmed) {
    return `/socket.io/?EIO=4&transport=websocket`
  }

  const hasProtocol = /^https?:\/\//.test(trimmed)

  if (hasProtocol) {
    const parsed = new URL(trimmed)
    const protocol = parsed.protocol === "https:" ? "wss:" : "ws:"
    const pathname = ensureLeadingSlash(`${parsed.pathname}/socket.io/`).replace(/\/+$/, "/")
    return `${protocol}//${parsed.host}${pathname}?EIO=4&transport=websocket`
  }

  const normalizedPath = ensureLeadingSlash(trimmed)
  return `${normalizedPath}/socket.io/?EIO=4&transport=websocket`
}

export function connectToSocketServer(url, handlers = {}) {
  return new Promise((resolve, reject) => {
    const wsUrl = buildWebSocketUrl(url)
    const socket = new WebSocket(wsUrl)
    let pingIntervalId
    let isReady = false

    const markReady = () => {
      if (isReady) return
      isReady = true
      resolve({ emit, close })
      handlers.onConnect?.()
    }

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
        markReady()
        return
      }

      if (message.startsWith("40")) {
        markReady()
        return
      }

      if (!message.startsWith("42")) return

      try {
        const [event, payload] = JSON.parse(message.slice(2))
        const eventHandlers = {
          syncState: handlers.onSyncState,
          videoEvent: handlers.onVideoEvent,
          error: handlers.onError,
          receive_message: handlers.onMessage,
        }

        if (eventHandlers[event]) {
          eventHandlers[event](payload)
        }

        handlers.onEvent?.(event, payload)
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