import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { db, apps } from '../db'
import { getAppHtml } from '../server/storage'

export const Route = createFileRoute('/api/apps/$appId/serve')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { appId } = params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(appId)) {
          return new Response('Invalid app ID', { status: 400 })
        }

        // Get app from database
        const app = await db.query.apps.findFirst({
          where: eq(apps.id, appId),
        })

        if (!app) {
          return new Response('App not found', { status: 404 })
        }

        if (app.status !== 'ready' || !app.htmlStoragePath) {
          return new Response('App not ready', { status: 404 })
        }

        // Get HTML from storage
        try {
          const html = await getAppHtml(app.htmlStoragePath)

          return new Response(html, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'X-Frame-Options': 'SAMEORIGIN',
              'X-Content-Type-Options': 'nosniff',
              'Referrer-Policy': 'strict-origin-when-cross-origin',
              'Content-Security-Policy': [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob: https:",
                "font-src 'self' data:",
                "connect-src 'self'",
                "frame-ancestors 'self'",
              ].join('; '),
              'Cache-Control': 'private, max-age=3600',
            },
          })
        } catch (error) {
          console.error('Failed to get app HTML:', error)
          return new Response('Failed to load app', { status: 500 })
        }
      },
    },
  },
})
