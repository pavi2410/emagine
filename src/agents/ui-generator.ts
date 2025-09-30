import { generateText } from 'ai'
import { openrouter, MODELS } from '../lib/openrouter'
import type { AgentContext, GeneratedApp, AgentError, PlanResult } from './types'

const UI_GENERATOR_PROMPT = `You are a UI generation agent that creates complete, self-contained HTML apps.

User wants: {{PROMPT}}

Plan:
{{PLAN}}

Generate a COMPLETE self-contained HTML file with:
1. All CSS in <style> tags (use modern, beautiful styling)
2. All JavaScript in <script> tags (vanilla JS, no external libraries)
3. Fully functional and interactive
4. Responsive design
5. Good UX with smooth animations

Requirements:
- Single HTML file, no external dependencies
- Use modern CSS (flexbox, grid, variables)
- Include proper error handling in JS
- Add helpful comments
- Make it visually appealing

Return ONLY the HTML code, nothing else. Start with <!DOCTYPE html>.`

const APP_NAME_PROMPT = `Based on this user request: "{{PROMPT}}"

Suggest a short app name (2-4 words) and an emoji icon that represents it.

Respond with JSON:
{
  "name": "App Name",
  "icon": "🎨"
}`

export async function uiGeneratorAgent(
  context: AgentContext & { plan: PlanResult }
): Promise<{ success: true; app: GeneratedApp } | { success: false; error: AgentError }> {
  try {
    // Generate app metadata
    const { text: metaText } = await generateText({
      model: openrouter.chat(MODELS.UI_GENERATOR),
      prompt: APP_NAME_PROMPT.replace('{{PROMPT}}', context.prompt),
      temperature: 0.7,
    })

    const meta = JSON.parse(metaText) as { name: string; icon: string }

    // Generate HTML
    const { text: html } = await generateText({
      model: openrouter.chat(MODELS.UI_GENERATOR),
      prompt: UI_GENERATOR_PROMPT
        .replace('{{PROMPT}}', context.prompt)
        .replace('{{PLAN}}', JSON.stringify(context.plan, null, 2)),
      temperature: 0.5,
      maxTokens: 4000,
    })

    return {
      success: true,
      app: {
        html: html.trim(),
        name: meta.name,
        icon: meta.icon
      }
    }
  } catch (error) {
    console.error('UI Generator error:', error)
    return {
      success: false,
      error: {
        type: 'generation_failed',
        message: error instanceof Error ? error.message : 'Failed to generate UI'
      }
    }
  }
}
