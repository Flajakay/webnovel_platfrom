import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: process.env.PORT || 3000,
    host: true
  },
  optimizeDeps: {
    include: ['react-quill-new'], // Ensure quill and react-quill-new are pre-bundled
    exclude: []
  },
  build: {
    commonjsOptions: {
      include: [/react-quill-new/, /node_modules/]
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        manualChunks: {
          'react-quill': ['react-quill-new']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  ssr: {
    noExternal: ['react-quill-new']
  }
})
