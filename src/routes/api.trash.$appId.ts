import { createFileRoute } from '@tanstack/react-router'
import { eq, and } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, apps } from '../db'
import { deleteAppHtml } from '../server/storage'

export const Route = createFileRoute('/api/trash/$appId')({
  server: {
    handlers: {
      // POST - Restore app from trash
      POST: async ({ request, params }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const { appId } = params

        // Verify the app exists and belongs to this user
        const app = await db.query.apps.findFirst({
          where: and(
            eq(apps.id, appId),
            eq(apps.userId, session.user.id)
          ),
        })

        if (!app) {
          return new Response(JSON.stringify({ error: 'App not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Restore app by setting deletedAt to null
        await db.update(apps)
          .set({ deletedAt: null, updatedAt: new Date() })
          .where(eq(apps.id, appId))

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },

      // DELETE - Permanently delete app
      DELETE: async ({ request, params }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const { appId } = params

        // Verify the app exists and belongs to this user
        const app = await db.query.apps.findFirst({
          where: and(
            eq(apps.id, appId),
            eq(apps.userId, session.user.id)
          ),
        })

        if (!app) {
          return new Response(JSON.stringify({ error: 'App not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Delete S3 file if exists
        if (app.htmlStoragePath) {
          try {
            await deleteAppHtml(app.htmlStoragePath)
          } catch (error) {
            console.error(`Failed to delete S3 file for app ${appId}:`, error)
          }
        }

        // Hard delete from database
        await db.delete(apps).where(eq(apps.id, appId))

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
