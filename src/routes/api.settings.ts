import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { auth } from '../server/auth'
import { db, userSettings } from '../db'

const UpdateSettingsSchema = z.object({
  selectedModel: z.string().optional(),
  enableThinking: z.boolean().optional(),
  theme: z.string().optional(),
  hasCompletedOOBE: z.boolean().optional(),
  wallpaper: z.string().optional(),
  accentColor: z.string().optional(),
  avatar: z.string().optional(),
})

export const Route = createFileRoute('/api/settings')({
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

        // Get or create settings
        let settings = await db.query.userSettings.findFirst({
          where: eq(userSettings.userId, session.user.id),
        })

        if (!settings) {
          // Create default settings
          const [created] = await db
            .insert(userSettings)
            .values({ userId: session.user.id })
            .returning()
          settings = created
        }

        return new Response(JSON.stringify({
          selectedModel: settings.selectedModel,
          enableThinking: settings.enableThinking,
          theme: settings.theme,
          hasCompletedOOBE: settings.hasCompletedOOBE,
          wallpaper: settings.wallpaper,
          accentColor: settings.accentColor,
          avatar: settings.avatar,
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },

      PUT: async ({ request }) => {
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

        const result = UpdateSettingsSchema.safeParse(body)
        if (!result.success) {
          return new Response(JSON.stringify({ error: 'Invalid request', details: result.error.issues }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const updates = result.data

        // Upsert settings
        const [settings] = await db
          .insert(userSettings)
          .values({
            userId: session.user.id,
            ...updates,
          })
          .onConflictDoUpdate({
            target: userSettings.userId,
            set: {
              ...updates,
              updatedAt: new Date(),
            },
          })
          .returning()

        return new Response(JSON.stringify({
          selectedModel: settings.selectedModel,
          enableThinking: settings.enableThinking,
          theme: settings.theme,
          hasCompletedOOBE: settings.hasCompletedOOBE,
          wallpaper: settings.wallpaper,
          accentColor: settings.accentColor,
          avatar: settings.avatar,
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
