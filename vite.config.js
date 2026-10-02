import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/victory-vendor')) {
            return 'charts'
          }
          if (id.includes('node_modules/react-kakao-maps-sdk')) {
            return 'kakao-maps'
          }
          return undefined
        },
      },
    },
  },
})
