import { createFileRoute } from '@tanstack/react-router'
import { eq, and, isNull } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, apps } from '../db'

export const Route = createFileRoute('/api/apps')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        // Only return non-deleted apps
        const userApps = await db.query.apps.findMany({
          where: and(
            eq(apps.userId, session.user.id),
            isNull(apps.deletedAt)
          ),
          orderBy: (apps, { desc }) => [desc(apps.createdAt)],
        })

        return new Response(JSON.stringify(userApps), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
