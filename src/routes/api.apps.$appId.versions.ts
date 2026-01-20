import { createFileRoute } from '@tanstack/react-router'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, apps, appVersions } from '../db'

export const Route = createFileRoute('/api/apps/$appId/versions')({
  server: {
    handlers: {
      // Get app version history
      GET: async ({ request, params }) => {
        const { appId } = params

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

        // Get all versions
        const versions = await db.query.appVersions.findMany({
          where: eq(appVersions.appId, appId),
          orderBy: desc(appVersions.version),
        })

        // Find current version (matches current htmlStoragePath)
        const currentVersion = versions.find(v => v.htmlStoragePath === app.htmlStoragePath)

        return new Response(JSON.stringify({
          versions: versions.map(v => ({
            id: v.id,
            version: v.version,
            prompt: v.prompt,
            createdAt: v.createdAt.toISOString(),
            isCurrent: v.htmlStoragePath === app.htmlStoragePath,
          })),
          currentVersion: currentVersion?.version ?? 1,
        }), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
