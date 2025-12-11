const streamingServiceUrl =
  import.meta.env.VITE_STREAMING_SERVICE_URL ||
  "https://watchparty-nodejs-streaming-service.onrender.com"

const apiUrl = import.meta.env.VITE_API_URL || streamingServiceUrl

if (!import.meta.env.VITE_API_URL && !import.meta.env.VITE_STREAMING_SERVICE_URL) {
  console.warn(
    "VITE_API_URL or VITE_STREAMING_SERVICE_URL is not set. Falling back to the hosted streaming service.",
  )
}

export const STREAMING_SERVICE_URL = streamingServiceUrl
export const API_URL = apiUrl