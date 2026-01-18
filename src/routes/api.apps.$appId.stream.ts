import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { db, apps } from '../db'

export const Route = createFileRoute('/api/apps/$appId/stream')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { appId } = params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(appId)) {
          return new Response('Invalid app ID', { status: 400 })
        }

        // Create SSE stream
        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder()

            const sendEvent = (data: object) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
            }

            // Poll for updates
            let attempts = 0
            const maxAttempts = 120 // 60 seconds max (500ms interval)

            const poll = async () => {
              attempts++

              const app = await db.query.apps.findFirst({
                where: eq(apps.id, appId),
              })

              if (!app) {
                sendEvent({ error: 'App not found' })
                controller.close()
                return
              }

              sendEvent({
                id: app.id,
                name: app.name,
                icon: app.icon,
                status: app.status,
                errorMessage: app.errorMessage,
                generationTimeMs: app.generationTimeMs,
              })

              if (app.status === 'ready' || app.status === 'error') {
                controller.close()
                return
              }

              if (attempts >= maxAttempts) {
                sendEvent({ error: 'Timeout waiting for generation' })
                controller.close()
                return
              }

              // Continue polling
              setTimeout(poll, 500)
            }

            poll()
          },
        })

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        })
      },
    },
  },
})
