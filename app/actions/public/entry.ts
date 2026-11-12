import { run } from 'remix/component'

// Modules in `public/` folders, keyed by the `/app/...` path that `clientEntry(import.meta.url, ...)`
// becomes (see `vite.config.ts`). Vite builds each one into its own browser chunk.
const modules = import.meta.glob<Record<string, unknown>>('/app/**/public/**/*.{ts,tsx}')

run({
  async loadModule(moduleUrl, exportName) {
    let load = modules[moduleUrl]
    if (!load) {
      throw new Error(`Unknown client entry module: ${moduleUrl}. Move it into a public/ folder.`)
    }
    let Component = (await load())[exportName]
    if (typeof Component !== 'function') {
      throw new Error(`Unknown component: ${moduleUrl}#${exportName}`)
    }
    return Component
  },
})
