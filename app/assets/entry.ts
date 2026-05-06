import { run } from 'remix/ui'

const clientModules = import.meta.glob(['../**/*.{ts,tsx}', '!../**/*.server.*'])

run({
  async loadModule(moduleUrl, exportName) {
    let pathname = new URL(moduleUrl, location.origin).pathname
    let load = clientModules[`..${pathname.slice('/app'.length)}`]

    if (!load) {
      throw new Error(`Unknown client entry module: ${moduleUrl}`)
    }

    let mod = await load()

    if (!mod || typeof mod !== 'object') {
      throw new Error(`Invalid client entry module: ${moduleUrl}`)
    }

    let entry = Reflect.get(mod, exportName)

    if (typeof entry !== 'function') {
      throw new Error(`Missing client entry export ${exportName} in ${moduleUrl}`)
    }

    return entry
  },
  async resolveFrame(src, signal, target) {
    let headers = new Headers({ accept: 'text/html' })
    if (target) headers.set('x-remix-target', target)

    let response = await fetch(src, {
      credentials: 'same-origin',
      headers,
      signal,
    })
    return response.body ?? response.text()
  },
})
