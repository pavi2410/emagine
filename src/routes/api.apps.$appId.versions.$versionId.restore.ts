import { createFileRoute } from '@tanstack/react-router'
import { eq, and } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, apps, appVersions } from '../db'

export const Route = createFileRoute('/api/apps/$appId/versions/$versionId/restore')({
  server: {
    handlers: {
      // Restore a specific version
      POST: async ({ request, params }) => {
        const { appId, versionId } = params

        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Get app and verify ownership
        const app = await db.query.apps.findFirst({
          where: and(eq(apps.id, appId), eq(apps.userId, session.user.id)),
        })

        if (!app) {
          return new Response(JSON.stringify({ error: 'App not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Get the version to restore
        const version = await db.query.appVersions.findFirst({
          where: and(
            eq(appVersions.id, versionId),
            eq(appVersions.appId, appId)
          ),
        })

        if (!version) {
          return new Response(JSON.stringify({ error: 'Version not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Update app to use this version's HTML and prompt
        await db.update(apps).set({
          htmlStoragePath: version.htmlStoragePath,
          prompt: version.prompt,
          updatedAt: new Date(),
        }).where(eq(apps.id, appId))

        return new Response(JSON.stringify({
          success: true,
          restoredVersion: version.version,
        }), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
