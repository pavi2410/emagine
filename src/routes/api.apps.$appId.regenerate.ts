import { createFileRoute } from '@tanstack/react-router'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, apps, appVersions } from '../db'
import { regenerateAppHtml } from '../server/generation'

export const Route = createFileRoute('/api/apps/$appId/regenerate')({
  server: {
    handlers: {
      // Regenerate app with optional new prompt
      POST: async ({ request, params }) => {
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

        // Parse request body
        let body: { prompt?: string; model?: string } = {}
        try {
          body = await request.json()
        } catch {
          // No body or invalid JSON, use existing prompt
        }

        const promptToUse = body.prompt?.trim() || app.prompt
        const modelToUse = body.model || app.modelUsed || 'z-ai/glm-4.5-air:free'

        if (!promptToUse) {
          return new Response(JSON.stringify({ error: 'No prompt available' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Get current version number
        const latestVersion = await db.query.appVersions.findFirst({
          where: eq(appVersions.appId, appId),
          orderBy: desc(appVersions.version),
        })

        const nextVersion = (latestVersion?.version ?? 0) + 1

        // Set status to generating and update model
        await db.update(apps).set({
          status: 'generating',
          modelUsed: modelToUse,
          errorMessage: null,
          updatedAt: new Date(),
        }).where(eq(apps.id, appId))

        // Start async regeneration (don't await)
        regenerateAppHtml(appId, promptToUse, modelToUse, nextVersion, session.user.id)
          .catch((error) => {
            console.error('Regeneration failed:', error)
          })

        return new Response(JSON.stringify({
          success: true,
          streamUrl: `/api/apps/${appId}/stream`,
        }), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
