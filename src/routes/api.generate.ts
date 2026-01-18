import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { auth } from '../server/auth'
import { generateApp } from '../server/generation'

const GenerateSchema = z.object({
  prompt: z.string().min(1).max(2000),
  model: z.string().optional(),
})

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

        const { prompt, model } = result.data

        // Start generation
        const { appId, streamUrl } = await generateApp({
          prompt,
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
