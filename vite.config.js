import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ── Production build settings ──────────────────────────────────────────
  base: '/',                  // All asset paths will be root-relative
  build: {
    outDir: 'dist',           // Output folder Netlify will serve
    emptyOutDir: true,        // Clean dist/ before every build
    sourcemap: false,         // Smaller bundle — disable source maps in prod
    rollupOptions: {
      output: {
        // Split vendor libs into a separate chunk for better caching
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },

  // ── Dev server settings ────────────────────────────────────────────────
  server: {
    port: 5173,
    open: true,
  },
})
