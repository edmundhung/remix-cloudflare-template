// Vite serves the browser entry from source in dev and builds it to `assets/entry.js`.
// `import.meta.env` only exists under Vite, so code running in plain Node, like `npm test`, gets the
// production path.
export const scriptEntry = {
  href: import.meta.env?.DEV ? '/app/actions/public/entry.ts' : '/assets/entry.js',
  importMap: {},
  preloads: [],
}

// Under Vite, `vite.config.ts` turns `clientEntry(import.meta.url, ...)` into `/app/...` IDs, which
// Remix uses as-is. Only code running without Vite, like `npm test`, still has `file:` IDs and
// reaches this. No browser loads them there.
export const assets = {
  async getScriptEntry(fileUrl: string) {
    return { href: fileUrl, importMap: { imports: {} }, preloads: [] }
  },
}
