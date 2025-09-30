import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'Emagine - AI Desktop',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Theme appearance="dark" accentColor="purple" radius="medium">
          {children}
          {/* Devtools disabled for production build */}
        </Theme>
        <Scripts />
      </body>
    </html>
  )
}
