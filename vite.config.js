import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite configuration for EtherPets frontend
 * Includes React plugin and development server settings
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // Automatically open browser
    host: true // Allow external access
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Generate source maps for debugging
    minify: 'esbuild' // Use esbuild for faster minification
  },
  resolve: {
    alias: {
      '@': '/src' // Optional path alias for cleaner imports
    }
  }
})