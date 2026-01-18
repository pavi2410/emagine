import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { auth } from '../server/auth'
import { generateApp } from '../server/generation'
import { db, workspaces, workspaceMembers } from '../db'

const GenerateSchema = z.object({
  prompt: z.string().min(1).max(2000),
  workspaceId: z.string().uuid(),
  model: z.string().optional(),
})

async function verifyWorkspaceAccess(userId: string, workspaceId: string): Promise<boolean> {
  // Check if user owns the workspace
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  })

  if (workspace?.ownerId === userId) {
    return true
  }

  // Check if user is a member
  const membership = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId)
    ),
  })

  return !!membership
}

export const Route = createFileRoute('/api/generate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Verify authentication
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Parse and validate body
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const result = GenerateSchema.safeParse(body)
        if (!result.success) {
          return new Response(JSON.stringify({ error: 'Invalid request', details: result.error.issues }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const { prompt, workspaceId, model } = result.data

        // Verify workspace access
        const hasAccess = await verifyWorkspaceAccess(session.user.id, workspaceId)
        if (!hasAccess) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Start generation
        const { appId, streamUrl } = await generateApp({
          prompt,
          workspaceId,
          userId: session.user.id,
          model,
        })

        return new Response(JSON.stringify({ appId, streamUrl }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
