import { fileURLToPath } from 'node:url'

import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: fileURLToPath(new URL('./client.ts', import.meta.url)),
          output: {
            entryFileNames: 'assets/client.js',
            chunkFileNames: 'assets/[name]-[hash].js',
          },
        },
      },
    },
  },
  plugins: [cloudflare()],
})
