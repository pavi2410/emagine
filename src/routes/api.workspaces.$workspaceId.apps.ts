import { createFileRoute } from '@tanstack/react-router'
import { eq, and, isNull } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, apps, workspaces, workspaceMembers } from '../db'

async function verifyWorkspaceAccess(userId: string, workspaceId: string): Promise<boolean> {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  })

  if (workspace?.ownerId === userId) {
    return true
  }

  const membership = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId)
    ),
  })

  return !!membership
}

export const Route = createFileRoute('/api/workspaces/$workspaceId/apps')({
  server: {
    handlers: {
      // List apps in workspace
      GET: async ({ request, params }) => {
        const { workspaceId } = params

        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Verify workspace access
        const hasAccess = await verifyWorkspaceAccess(session.user.id, workspaceId)
        if (!hasAccess) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Get apps (excluding soft-deleted ones)
        const workspaceApps = await db.query.apps.findMany({
          where: and(
            eq(apps.workspaceId, workspaceId),
            isNull(apps.deletedAt)
          ),
          orderBy: (apps, { desc }) => [desc(apps.createdAt)],
        })

        // Transform for client (exclude storage paths)
        const clientApps = workspaceApps.map((app) => ({
          id: app.id,
          name: app.name,
          icon: app.icon,
          description: app.description,
          status: app.status,
          createdAt: app.createdAt.toISOString(),
          updatedAt: app.updatedAt.toISOString(),
        }))

        return new Response(JSON.stringify(clientApps), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
