import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const proxyTarget = (() => {
    const target = env.VITE_API_URL || env.VITE_STREAMING_SERVICE_URL
    if (target && /^https?:\/\//.test(target)) {
      return target
    }
    return 'https://watchparty-nodejs-streaming-service.onrender.com'
  })()

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/stream-service/api': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/stream-service\/api/, '/api'),
        },
        '/stream-service/socket.io': {
          target: proxyTarget,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/stream-service\/socket.io/, '/socket.io'),
        },
      },
    },
  }
})