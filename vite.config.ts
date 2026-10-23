import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `base: './'` keeps asset URLs relative, so the same build works on
// GitHub Pages (including project pages served from /<repo>/) and locally.
export default defineConfig({
  plugins: [react()],
  base: './',
})
