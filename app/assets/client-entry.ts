import type { RequestContext } from 'remix/fetch-router'

export function clientEntry({ request }: RequestContext) {
  let builtClientEntryUrl = new URL('/assets/clientEntry.js', request.url)

  return fetch(builtClientEntryUrl).then((response) => {
    if (response.ok) {
      return Response.redirect(builtClientEntryUrl, 307)
    }

    return Response.redirect(new URL('/app/assets/entry.ts', request.url), 307)
  })
}
