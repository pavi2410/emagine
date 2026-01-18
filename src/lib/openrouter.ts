import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { settings } from '../stores/settings'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''

export const openrouter = createOpenRouter({
  apiKey: OPENROUTER_API_KEY,
})

/**
 * Get the currently selected model from settings
 */
export function getCurrentModel() {
  const { selectedModel } = settings.get()
  return selectedModel
}

// Legacy MODELS object - now dynamically reads from settings
export const MODELS = {
  get ORCHESTRATOR() { return getCurrentModel() },
  get PLANNER() { return getCurrentModel() },
  get UI_GENERATOR() { return getCurrentModel() },
  get LOGIC_GENERATOR() { return getCurrentModel() },
  get FALLBACK() { return getCurrentModel() },
} as const
