import { createFileRoute } from '@tanstack/react-router'
import { auth } from '../server/auth'

// Catch-all route for Better Auth API endpoints
// Handles: /api/auth/sign-in, /api/auth/sign-up, /api/auth/sign-out, etc.
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return auth.handler(request)
      },
      POST: async ({ request }) => {
        return auth.handler(request)
      },
    },
  },
})
