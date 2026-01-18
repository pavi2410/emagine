import { generateText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { eq } from 'drizzle-orm'
import { db, apps, appVersions } from '../db'
import { saveAppHtml } from './storage'

// Server-side OpenRouter client (uses server env var, not client-side)
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
})

// Default model
const DEFAULT_MODEL = 'mistralai/devstral-2512:free'

interface GenerateAppParams {
  prompt: string
  workspaceId: string
  userId: string // Reserved for future use (attribution, limits, etc.)
  model?: string
}

interface GenerateAppResult {
  appId: string
  streamUrl: string
}

/**
 * Start app generation
 * Creates app record in 'generating' state and returns immediately
 * Actual generation happens asynchronously
 */
export async function generateApp({
  prompt,
  workspaceId,
  userId: _userId, // Prefixed with underscore to suppress unused warning
  model = DEFAULT_MODEL,
}: GenerateAppParams): Promise<GenerateAppResult> {
  // Create app record in 'generating' state
  const [app] = await db.insert(apps).values({
    workspaceId,
    name: 'Generating...',
    icon: '🔄',
    prompt,
    modelUsed: model,
    status: 'generating',
  }).returning()

  // Start async generation (don't await)
  generateAppAsync(app.id, prompt, model).catch((error) => {
    console.error('Background generation failed:', error)
  })

  return {
    appId: app.id,
    streamUrl: `/api/apps/${app.id}/stream`,
  }
}

/**
 * Async app generation - runs in background
 */
async function generateAppAsync(
  appId: string,
  prompt: string,
  model: string
): Promise<void> {
  const startTime = Date.now()

  try {
    // Step 1: Generate metadata
    const metaPrompt = `For this request: "${prompt}"

Generate app metadata in JSON format:
{
  "name": "App Name (2-4 words)",
  "icon": "📱",
  "description": "Brief description"
}

Only return the JSON, nothing else.`

    const { text: metaJson } = await generateText({
      model: openrouter.chat(model),
      prompt: metaPrompt,
      temperature: 0.7,
    })

    let metadata: { name: string; icon: string; description: string }
    try {
      const cleanJson = metaJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      metadata = JSON.parse(cleanJson)
    } catch {
      console.error('Failed to parse metadata:', metaJson)
      metadata = {
        name: 'Generated App',
        icon: '📱',
        description: prompt,
      }
    }

    // Update app with metadata
    await db.update(apps)
      .set({
        name: metadata.name,
        icon: metadata.icon,
        description: metadata.description,
      })
      .where(eq(apps.id, appId))

    // Step 2: Generate HTML
    const htmlPrompt = `Create a complete, self-contained HTML app for: "${prompt}"

Requirements:
- Single HTML file with embedded CSS and JavaScript
- Modern, beautiful UI using flexbox/grid
- Fully functional and interactive
- Responsive design
- Good UX with smooth animations
- No external dependencies

Return ONLY the HTML code, starting with <!DOCTYPE html>.`

    const { text: html } = await generateText({
      model: openrouter.chat(model),
      prompt: htmlPrompt,
      temperature: 0.5,
      maxOutputTokens: 8000,
    })

    // Clean HTML
    let cleanHtml = html.trim()
    if (cleanHtml.startsWith('```html')) {
      cleanHtml = cleanHtml.replace(/^```html\n?/, '')
    }
    if (cleanHtml.startsWith('```')) {
      cleanHtml = cleanHtml.replace(/^```\n?/, '')
    }
    if (cleanHtml.endsWith('```')) {
      cleanHtml = cleanHtml.replace(/\n?```$/, '')
    }

    // Save HTML to S3
    const storagePath = await saveAppHtml(appId, cleanHtml)

    // Update app as ready
    await db.update(apps).set({
      htmlStoragePath: storagePath,
      status: 'ready',
      generationTimeMs: Date.now() - startTime,
      updatedAt: new Date(),
    }).where(eq(apps.id, appId))

    // Create version record
    await db.insert(appVersions).values({
      appId,
      version: 1,
      htmlStoragePath: storagePath,
      prompt,
    })

  } catch (error) {
    console.error('Generation error:', error)

    await db.update(apps).set({
      status: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      updatedAt: new Date(),
    }).where(eq(apps.id, appId))
  }
}

/**
 * Get app status for SSE streaming
 */
export async function getAppStatus(appId: string) {
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, appId),
  })

  if (!app) return null

  return {
    id: app.id,
    name: app.name,
    icon: app.icon,
    status: app.status,
    errorMessage: app.errorMessage,
    generationTimeMs: app.generationTimeMs,
  }
}
