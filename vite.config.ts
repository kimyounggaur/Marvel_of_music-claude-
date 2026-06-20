import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/Marvel_of_music-claude-/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
