import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from 'flowbite-react/plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    minify: true,
    outDir: 'dist',
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true, // not necessary
    port: 3000, // you can replace this port with any port
  },
  plugins: [
    react(),
    checker({ typescript: true }),
    tailwindcss(),
    flowbiteReact(),
  ],
})
