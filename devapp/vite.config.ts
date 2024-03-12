import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  base: '/', // change if you're deploying to github pages
  resolve: {
    preserveSymlinks: true // necessary for yarn link to work
  },
  build: {
    minify: false
  }
})
