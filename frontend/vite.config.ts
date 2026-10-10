import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        // Port 8000 is occupied locally by an unrelated Docker application.
        // Keep CloudPrint's development API isolated on 8001.
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
      },
    },
  },
})
