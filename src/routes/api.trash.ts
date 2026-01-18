import { createFileRoute } from '@tanstack/react-router'
import { eq, and, isNotNull } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, apps } from '../db'
import { deleteAppHtml } from '../server/storage'

export const Route = createFileRoute('/api/trash')({
  server: {
    handlers: {
      // GET - List trashed apps
      GET: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Return only deleted apps
        const trashedApps = await db.query.apps.findMany({
          where: and(
            eq(apps.userId, session.user.id),
            isNotNull(apps.deletedAt)
          ),
          orderBy: (apps, { desc }) => [desc(apps.deletedAt)],
        })

        return new Response(JSON.stringify(trashedApps), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },

      // DELETE - Empty trash (hard delete all trashed apps)
      DELETE: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Get all trashed apps for this user
        const trashedApps = await db.query.apps.findMany({
          where: and(
            eq(apps.userId, session.user.id),
            isNotNull(apps.deletedAt)
          ),
        })

        // Delete S3 files for each app
        for (const app of trashedApps) {
          if (app.htmlStoragePath) {
            try {
              await deleteAppHtml(app.htmlStoragePath)
            } catch (error) {
              console.error(`Failed to delete S3 file for app ${app.id}:`, error)
            }
          }
        }

        // Hard delete from database
        await db.delete(apps).where(
          and(
            eq(apps.userId, session.user.id),
            isNotNull(apps.deletedAt)
          )
        )

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
