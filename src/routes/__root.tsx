import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { BSOD } from '@/components/BSOD/BSOD'

function RootErrorComponent({ error }: { error: Error }) {
  const errorCode = (error as Error & { code?: string }).code || 'UNKNOWN'
  return (
    <BSOD
      errorCode={errorCode}
      message={error.message || 'An unexpected error occurred'}
      onRestart={() => window.location.reload()}
    />
  )
}

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

  errorComponent: RootErrorComponent,
})

import { Toaster } from 'sonner'

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-950 text-white antialiased" suppressHydrationWarning>
        {children}
        <Toaster theme="dark" position="top-center" />
        <Scripts />
      </body>
    </html>
  )
}
