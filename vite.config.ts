import { fileURLToPath } from 'node:url'

import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'

const clientEntryPath = fileURLToPath(new URL('./app/assets/entry.ts', import.meta.url))

export default defineConfig({
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: {
            clientEntry: clientEntryPath,
          },
          output: {
            entryFileNames: 'assets/[name].js',
            chunkFileNames: 'assets/[name]-[hash].js',
          },
        },
      },
    },
  },
  plugins: [cloudflare()],
})
