import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig, type Plugin } from 'vite'

export default defineConfig({
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: fileURLToPath(new URL('./app/actions/public/entry.ts', import.meta.url)),
          output: {
            entryFileNames: 'assets/entry.js',
            chunkFileNames: 'assets/[name]-[hash].js',
          },
        },
      },
      // Found late otherwise, which reloads the page on the first dev visit.
      optimizeDeps: { include: ['remix/component', 'remix/component/jsx-dev-runtime'] },
    },
  },
  plugins: [clientEntryIds(), cloudflare()],
})

/**
 * Rewrites `clientEntry(import.meta.url, ...)` to the module's `/app/...` path, for example
 * `clientEntry('/app/actions/public/prompt-button.tsx#PromptButton', ...)`.
 *
 * In a deployed Worker, `import.meta.url` doesn't point at the component's source file, so it
 * can't identify the component. `app/actions/public/entry.ts` maps these paths to browser modules
 * with `import.meta.glob()`.
 */
function clientEntryIds(): Plugin {
  let root = process.cwd()

  return {
    name: 'client-entry-ids',
    configResolved(config) {
      root = config.root
    },
    transform(code, id) {
      if (!code.includes('clientEntry') || !code.includes('import.meta.url')) return

      let moduleId = `/${path.relative(root, id.split('?')[0]).replaceAll(path.sep, '/')}`
      let result = code.replace(
        /(?:\bexport\s+(?:const|let|var)\s+([\w$]+)\s*=\s*)?\bclientEntry\s*\(\s*import\.meta\.url\b/g,
        (match, exportName?: string) =>
          match.replace(
            /import\.meta\.url$/,
            JSON.stringify(exportName ? `${moduleId}#${exportName}` : moduleId),
          ),
      )

      // Only `import.meta.url` changes, within its line, so existing source maps stay usable.
      if (result !== code) return { code: result, map: null }
    },
  }
}
