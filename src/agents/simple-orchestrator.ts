import { generateText } from 'ai'
import { openrouter, MODELS } from '../lib/openrouter'
import type { AgentContext, StreamingGenerationResult } from './types'
import { addApp } from '../stores/desktop'
import { openWindow } from '../stores/windows'
import {
  startStreaming,
  completeStreaming,
  setStreamingError,
  addProgressDelta,
  setHtmlTarget,
  addHtmlChunk
} from '../stores/streaming'

/**
 * Simple orchestrator without complex tool system
 * Generates app in one shot
 */
export async function simpleOrchestratorAgent(
  context: AgentContext
): Promise<StreamingGenerationResult> {
  try {
    startStreaming()

    // Step 1: Generate app metadata
    addProgressDelta(10, 'Planning app...')

    const metaPrompt = `For this request: "${context.prompt}"

Generate app metadata in JSON format:
{
  "name": "App Name (2-4 words)",
  "icon": "📱",
  "description": "Brief description"
}

Only return the JSON, nothing else.`

    const { text: metaJson } = await generateText({
      model: openrouter.chat(MODELS.ORCHESTRATOR),
      prompt: metaPrompt,
      temperature: 0.7
    })

    let metadata
    try {
      const cleanJson = metaJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      metadata = JSON.parse(cleanJson)
    } catch (e) {
      console.error('Failed to parse metadata:', metaJson)
      metadata = {
        name: 'Generated App',
        icon: '📱',
        description: context.prompt
      }
    }

    // Step 2: Create app
    addProgressDelta(30, 'Creating app...')

    const appId = crypto.randomUUID()
    addApp({
      id: appId,
      name: metadata.name,
      icon: metadata.icon,
      html: '', // Will be updated
      createdAt: Date.now()
    })

    // Step 3: Open window
    addProgressDelta(40, 'Opening window...')
    openWindow(appId)
    setHtmlTarget(appId)

    // Step 4: Generate HTML
    addProgressDelta(50, 'Generating HTML...')

    const htmlPrompt = `Create a complete, self-contained HTML app for: "${context.prompt}"

Requirements:
- Single HTML file with embedded CSS and JavaScript
- Modern, beautiful UI using flexbox/grid
- Fully functional and interactive
- Responsive design
- Good UX with smooth animations
- No external dependencies

Return ONLY the HTML code, starting with <!DOCTYPE html>.`

    const { text: html } = await generateText({
      model: openrouter.chat(MODELS.ORCHESTRATOR),
      prompt: htmlPrompt,
      temperature: 0.5,
      maxTokens: 4000
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

    // Update app with HTML
    addProgressDelta(90, 'Finalizing...')
    addHtmlChunk(cleanHtml, appId)

    // Update the app store
    const apps = (await import('../stores/desktop')).apps
    const currentApps = apps.get()
    const appIndex = currentApps.findIndex(a => a.id === appId)
    if (appIndex !== -1) {
      const updatedApps = [...currentApps]
      updatedApps[appIndex] = {
        ...updatedApps[appIndex],
        html: cleanHtml
      }
      apps.set(updatedApps)
    }

    addProgressDelta(100, 'Complete!')
    completeStreaming()

    return {
      success: true,
      appId
    }
  } catch (error) {
    console.error('Simple orchestrator error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    setStreamingError(errorMessage)

    return {
      success: false,
      error: {
        type: 'unknown',
        message: errorMessage
      }
    }
  }
}
