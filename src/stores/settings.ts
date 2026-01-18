import { atom } from 'nanostores'

/**
 * Available AI models for generation
 */
export const AVAILABLE_MODELS = {
  'mistralai/devstral-2512:free': {
    name: 'Devstral (Free)',
    provider: 'Mistral AI',
    description: 'Code-focused model optimized for development tasks',
    supportsTools: true
  },
  'xiaomi/mimo-v2-flash:free': {
    name: 'MiMo v2 Flash (Free)',
    provider: 'Xiaomi',
    description: 'Fast and efficient model from Xiaomi',
    supportsTools: true
  },
  'google/gemini-2.0-flash-exp:free': {
    name: 'Gemini 2.0 Flash (Free)',
    provider: 'Google',
    description: 'Fast and free model from Google',
    supportsTools: true
  }
} as const

export type ModelId = keyof typeof AVAILABLE_MODELS

/**
 * Settings state
 */
export interface SettingsState {
  selectedModel: ModelId
  enableThinking: boolean
  apiKey?: string
}

/**
 * Settings store (TODO: persist to localStorage)
 */
export const settings = atom<SettingsState>({
  selectedModel: 'mistralai/devstral-2512:free',
  enableThinking: false
})

/**
 * Update selected model
 */
export function setSelectedModel(modelId: ModelId) {
  const current = settings.get()
  settings.set({
    ...current,
    selectedModel: modelId
  })
}

/**
 * Toggle thinking display
 */
export function setEnableThinking(enabled: boolean) {
  const current = settings.get()
  settings.set({
    ...current,
    enableThinking: enabled
  })
}

/**
 * Set API key
 */
export function setApiKey(key: string) {
  const current = settings.get()
  settings.set({
    ...current,
    apiKey: key
  })
}

/**
 * Get current model info
 */
export function getCurrentModelInfo() {
  const { selectedModel } = settings.get()
  return AVAILABLE_MODELS[selectedModel]
}
