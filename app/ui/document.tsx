import type { RemixNode } from 'remix/ui'

export interface DocumentProps {
  children?: RemixNode
  title?: string
}

const DEFAULT_TITLE = decodeURIComponent('Remix%20Cloudflare%20Template')
const CLIENT_ENTRY_SRC = import.meta.env.DEV ? '/client.ts' : '/assets/client.js'

export function Document() {
  return ({ title = DEFAULT_TITLE, children }: DocumentProps) => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </head>
      <body>
        {children}
        <script type="module" src={CLIENT_ENTRY_SRC}></script>
      </body>
    </html>
  )
}
