import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''

export const openrouter = createOpenRouter({
  apiKey: OPENROUTER_API_KEY,
})

export const MODELS = {
  ORCHESTRATOR: 'x-ai/grok-4-fast:free',
  PLANNER: 'deepseek/deepseek-r1-0528:free',
  UI_GENERATOR: 'x-ai/grok-4-fast:free',
  LOGIC_GENERATOR: 'deepseek/deepseek-chat-v3.1:free',
  FALLBACK: 'qwen/qwq-32b:free',
} as const
