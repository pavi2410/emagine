import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, workspaces, workspaceMembers } from '../db'

const CreateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
})

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) + '-' + Math.random().toString(36).slice(2, 8)
}

export const Route = createFileRoute('/api/workspaces')({
  server: {
    handlers: {
      // List user's workspaces
      GET: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Get workspaces where user is owner or member
        const ownedWorkspaces = await db.query.workspaces.findMany({
          where: eq(workspaces.ownerId, session.user.id),
        })

        const memberships = await db.query.workspaceMembers.findMany({
          where: eq(workspaceMembers.userId, session.user.id),
          with: {
            workspace: true,
          },
        })

        const memberWorkspaces = memberships
          .map((m) => m.workspace)
          .filter((w) => w.ownerId !== session.user.id)

        const allWorkspaces = [...ownedWorkspaces, ...memberWorkspaces]

        return new Response(JSON.stringify(allWorkspaces), {
          headers: { 'Content-Type': 'application/json' },
        })
      },

      // Create new workspace
      POST: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        let body: unknown
        try {
          body = await request.json()
        } catch {
          return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const result = CreateWorkspaceSchema.safeParse(body)
        if (!result.success) {
          return new Response(JSON.stringify({ error: 'Invalid request', details: result.error.issues }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const { name } = result.data

        // Create workspace
        const [workspace] = await db.insert(workspaces).values({
          name,
          slug: generateSlug(name),
          ownerId: session.user.id,
        }).returning()

        // Add owner as member with 'owner' role
        await db.insert(workspaceMembers).values({
          workspaceId: workspace.id,
          userId: session.user.id,
          role: 'owner',
        })

        return new Response(JSON.stringify(workspace), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
