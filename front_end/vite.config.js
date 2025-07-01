import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    charset: 'utf8'
  },
  esbuild: {
    charset: 'utf8'
  },
  define: {
    __CHARSET__: '"utf-8"'
  }
})
