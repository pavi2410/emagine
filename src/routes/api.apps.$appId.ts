import { createFileRoute } from '@tanstack/react-router'
import { eq, and } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, apps } from '../db'

async function verifyAppAccess(userId: string, appId: string): Promise<boolean> {
  const app = await db.query.apps.findFirst({
    where: and(eq(apps.id, appId), eq(apps.userId, userId)),
  })

  return !!app
}

export const Route = createFileRoute('/api/apps/$appId')({
  server: {
    handlers: {
      // Get app details
      GET: async ({ request, params }) => {
        const { appId } = params

        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Verify access
        const hasAccess = await verifyAppAccess(session.user.id, appId)
        if (!hasAccess) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const app = await db.query.apps.findFirst({
          where: eq(apps.id, appId),
        })

        if (!app) {
          return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Transform for client
        const clientApp = {
          id: app.id,
          name: app.name,
          icon: app.icon,
          description: app.description,
          status: app.status,
          prompt: app.prompt,
          modelUsed: app.modelUsed,
          generationTimeMs: app.generationTimeMs,
          createdAt: app.createdAt.toISOString(),
          updatedAt: app.updatedAt.toISOString(),
        }

        return new Response(JSON.stringify(clientApp), {
          headers: { 'Content-Type': 'application/json' },
        })
      },

      // Soft delete app
      DELETE: async ({ request, params }) => {
        const { appId } = params

        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Verify access
        const hasAccess = await verifyAppAccess(session.user.id, appId)
        if (!hasAccess) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Soft delete
        await db.update(apps).set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        }).where(eq(apps.id, appId))

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
