const proxyPath = "/stream-service"

const streamingServiceUrl =
  import.meta.env.VITE_STREAMING_SERVICE_URL ||
  import.meta.env.VITE_API_URL ||
  proxyPath

const apiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_STREAMING_SERVICE_URL ||
  proxyPath

if (!import.meta.env.VITE_API_URL && !import.meta.env.VITE_STREAMING_SERVICE_URL) {
  console.warn(`API URLs are not set. Falling back to the proxied path: ${apiUrl}.`)
}

export const STREAMING_SERVICE_URL = streamingServiceUrl
export const API_URL = apiUrl