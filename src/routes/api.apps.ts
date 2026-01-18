import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
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

        const userApps = await db.query.apps.findMany({
          where: eq(apps.userId, session.user.id),
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
