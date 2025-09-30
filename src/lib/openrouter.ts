import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''

export const openrouter = createOpenRouter({
  apiKey: OPENROUTER_API_KEY,
})

// Using Grok 4 Fast exclusively for testing
// This model is free on OpenRouter (limited time)
const GROK_4_FAST_FREE = 'x-ai/grok-4-fast:free'

export const MODELS = {
  ORCHESTRATOR: GROK_4_FAST_FREE,
  PLANNER: GROK_4_FAST_FREE,
  UI_GENERATOR: GROK_4_FAST_FREE,
  LOGIC_GENERATOR: GROK_4_FAST_FREE,
  FALLBACK: GROK_4_FAST_FREE,
} as const
