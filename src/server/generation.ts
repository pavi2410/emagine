import { generateText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { eq } from 'drizzle-orm'
import { db, apps, appVersions, userSettings } from '../db'
import { saveAppHtml } from './storage'
import { env } from '../env'
import { DEFAULT_SYSTEM_PROMPT } from '../queries/settings'

// Server-side OpenRouter client (uses server env var, not client-side)
const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})

// Default model
const DEFAULT_MODEL = 'z-ai/glm-4.5-air:free'

/**
 * Extract HTML from LLM response, handling markdown fences and extra text
 */
function extractHtml(response: string): string {
  let html = response.trim()

  // Extract from markdown fence if present
  const fenceMatch = html.match(/```(?:html)?\n?([\s\S]*?)\n?```/)
  if (fenceMatch) {
    html = fenceMatch[1].trim()
  }

  // Find DOCTYPE and truncate any text before it
  const doctypeIdx = html.toLowerCase().indexOf('<!doctype html>')
  if (doctypeIdx > 0) {
    html = html.substring(doctypeIdx)
  }

  // Find </html> and truncate any text after it
  const closeIdx = html.toLowerCase().lastIndexOf('</html>')
  if (closeIdx !== -1) {
    html = html.substring(0, closeIdx + 7)
  }

  return html.trim()
}

/**
 * Extract JSON from LLM response, handling markdown fences and extra text
 */
function extractJson(response: string): { name: string; icon: string; description: string } {
  let json = response.trim()

  // Remove markdown code fences
  json = json.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')

  // Find JSON object boundaries
  const first = json.indexOf('{')
  const last = json.lastIndexOf('}')
  if (first !== -1 && last > first) {
    json = json.substring(first, last + 1)
  }

  return JSON.parse(json)
}

interface GenerateAppParams {
  prompt: string
  userId: string
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
  userId,
  model = DEFAULT_MODEL,
}: GenerateAppParams): Promise<GenerateAppResult> {
  // Create app record in 'generating' state
  const [app] = await db.insert(apps).values({
    userId,
    name: 'Generating...',
    icon: '🔄',
    prompt,
    modelUsed: model,
    status: 'generating',
  }).returning()

  // Start async generation (don't await)
  generateAppAsync(app.id, prompt, model, userId).catch((error) => {
    console.error('Background generation failed:', error)
  })

  return {
    appId: app.id,
    streamUrl: `/api/apps/${app.id}/stream`,
  }
}

/**
 * Get user's system prompt from settings
 */
async function getUserSystemPrompt(userId: string): Promise<string> {
  const settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  })
  return settings?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT
}

/**
 * Async app generation - runs in background
 */
async function generateAppAsync(
  appId: string,
  prompt: string,
  model: string,
  userId: string
): Promise<void> {
  const startTime = Date.now()

  try {
    // Get user's system prompt
    const systemPrompt = await getUserSystemPrompt(userId)

    // Step 1: Generate metadata
    const metaPrompt = `You are a JSON generator. Output ONLY valid JSON, no explanation.
DO NOT wrap in code blocks. DO NOT add commentary.

For: "${prompt}"
Output: {"name": "2-4 word title", "icon": "single emoji", "description": "one sentence max 100 chars"}`

    const { text: metaJson } = await generateText({
      model: openrouter.chat(model),
      prompt: metaPrompt,
      temperature: 0.3,
    })

    let metadata: { name: string; icon: string; description: string }
    try {
      metadata = extractJson(metaJson)
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

    // Step 2: Generate HTML with system prompt
    const htmlPrompt = `${systemPrompt}

---

USER REQUEST: ${prompt}`

    const { text: html } = await generateText({
      model: openrouter.chat(model),
      prompt: htmlPrompt,
      temperature: 0.4,
      maxOutputTokens: 8000,
    })

    // Clean HTML - extract only the HTML content
    const cleanHtml = extractHtml(html)

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
 * Regenerate app HTML only (keeps existing metadata)
 * Used when user edits prompt and wants to regenerate
 */
export async function regenerateAppHtml(
  appId: string,
  prompt: string,
  model: string,
  version: number,
  userId: string
): Promise<void> {
  const startTime = Date.now()

  try {
    // Get user's system prompt
    const systemPrompt = await getUserSystemPrompt(userId)

    // Generate HTML with system prompt
    const htmlPrompt = `${systemPrompt}

---

USER REQUEST: ${prompt}`

    const { text: html } = await generateText({
      model: openrouter.chat(model),
      prompt: htmlPrompt,
      temperature: 0.4,
      maxOutputTokens: 8000,
    })

    // Clean HTML
    const cleanHtml = extractHtml(html)

    // Save HTML to S3
    const storagePath = await saveAppHtml(appId, cleanHtml)

    // Update app
    await db.update(apps).set({
      htmlStoragePath: storagePath,
      prompt,
      status: 'ready',
      generationTimeMs: Date.now() - startTime,
      updatedAt: new Date(),
    }).where(eq(apps.id, appId))

    // Create version record
    await db.insert(appVersions).values({
      appId,
      version,
      htmlStoragePath: storagePath,
      prompt,
    })

  } catch (error) {
    console.error('Regeneration error:', error)

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
